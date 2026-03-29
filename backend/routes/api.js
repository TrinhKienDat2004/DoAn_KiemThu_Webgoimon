const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. Authenticate / Login Table
router.post('/auth', async (req, res) => {
    try {
        const { table_number, area } = req.body;
        // Verify if table exists
        const [rows] = await db.query('SELECT * FROM restaurant_tables WHERE table_number = ?', [table_number]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Bàn không tồn tại. Vui lòng kiểm tra lại.' });
        }
        res.json({ message: 'Xác thực thành công', table: rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// 2. Get Menu (Categories + Items)
router.get('/menu', async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        const [items] = await db.query('SELECT * FROM food_items');
        res.json({ categories, items });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// 3. Submit Order
router.post('/orders', async (req, res) => {
    try {
        const { table_number, cartItems, totalAmount } = req.body;
        
        // Find table ID
        const [tables] = await db.query('SELECT id, area FROM restaurant_tables WHERE table_number = ?', [table_number]);
        if (tables.length === 0) return res.status(400).json({ error: 'Bàn không hợp lệ' });
        const table = tables[0];

        // Create Order
        const [orderResult] = await db.query(
            'INSERT INTO orders (table_id, table_number, area, status, total_amount) VALUES (?, ?, ?, ?, ?)',
            [table.id, table_number, table.area, 'Chờ xác nhận', totalAmount]
        );
        const orderId = orderResult.insertId;

        // Insert Order Items
        for (let item of cartItems) {
            await db.query(
                'INSERT INTO order_items (order_id, food_item_id, quantity, options_spice, options_ice, notes, price_at_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.spiceLevel || null, item.iceLevel || null, item.notes || '', item.price]
            );
        }

        res.json({ message: 'Đặt món thành công!', orderId: orderId });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// 4. Get Order Status for a table
router.get('/orders/status/:tableNo', async (req, res) => {
    try {
        const tableNo = req.params.tableNo;
        const [orders] = await db.query(
            'SELECT o.id, o.status, o.total_amount, o.created_at, SUM(oi.quantity) as total_items ' +
            'FROM orders o ' +
            'JOIN order_items oi ON o.id = oi.order_id ' +
            'WHERE o.table_number = ? ' +
            'GROUP BY o.id ' +
            'ORDER BY o.created_at DESC LIMIT 10',
            [tableNo]
        );

        // Fetch detailed items for each order
        for (let order of orders) {
            const [items] = await db.query(
                `SELECT oi.*, f.name 
                 FROM order_items oi 
                 JOIN food_items f ON oi.food_item_id = f.id 
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// 4.1 Cancel Order
router.put('/orders/:id/cancel', async (req, res) => {
    try {
        const orderId = req.params.id;
        const [orders] = await db.query('SELECT status FROM orders WHERE id = ?', [orderId]);
        if (orders.length === 0) return res.status(404).json({ error: 'Order not found' });
        
        if (orders[0].status !== 'Chờ xác nhận') {
            return res.status(400).json({ error: 'Chỉ có thể hủy đơn khi bếp chưa tiếp nhận!' });
        }
        
        await db.query('UPDATE orders SET status = "Đã hủy" WHERE id = ?', [orderId]);
        res.json({ message: 'Đã hủy đơn thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// 4.2 Checkout / Get Invoice
router.post('/orders/checkout', async (req, res) => {
    try {
        const { table_number } = req.body;
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE table_number = ? AND status != "Đã thanh toán" AND status != "Đã hủy"',
            [table_number]
        );
        
        if (orders.length === 0) {
            return res.status(400).json({ error: 'Không có món nào cần thanh toán.' });
        }
        
        let finalTotal = 0;
        let invoiceItems = [];
        
        for (let order of orders) {
            finalTotal += Number(order.total_amount);
            const [items] = await db.query(
                `SELECT oi.*, f.name 
                 FROM order_items oi JOIN food_items f ON oi.food_item_id = f.id 
                 WHERE oi.order_id = ?`, [order.id]
            );
            invoiceItems.push(...items);
        }
        
        // Mark all as Paid
        await db.query(
            'UPDATE orders SET status = "Đã thanh toán" WHERE table_number = ? AND status != "Đã thanh toán" AND status != "Đã hủy"',
            [table_number]
        );
        
        res.json({ 
            message: 'Yêu cầu thanh toán thành công!',
            invoice: { table: table_number, total: finalTotal, items: invoiceItems, time: new Date() }
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// 5. Call Staff Support
router.post('/call-staff', async (req, res) => {
    try {
        const { table_number } = req.body;
        const [tables] = await db.query('SELECT area FROM restaurant_tables WHERE table_number = ?', [table_number]);
        const area = tables.length > 0 ? tables[0].area : 'Khác';

        await db.query(
            'INSERT INTO support_calls (table_number, area, status) VALUES (?, ?, ?)',
            [table_number, area, 'Chờ xử lý']
        );
        res.json({ message: 'Đã gửi yêu cầu gọi phục vụ. Nhân viên sẽ đến ngay!' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

module.exports = router;
