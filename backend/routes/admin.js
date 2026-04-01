const express = require('express');
const router = express.Router();
const db = require('../config/db');

// --- 14. ADMIN LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });
        }
        
        const admin = rows[0];
        res.json({ 
            message: 'Đăng nhập thành công', 
            admin: { id: admin.id, username: admin.username, role: admin.role } 
        });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// --- 17. KITCHEN DASHBOARD (Get all active orders) ---
router.get('/orders', async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE status != "Đã thanh toán" AND status != "Đã hủy" ORDER BY created_at ASC'
        );
        
        for (let order of orders) {
            const [items] = await db.query(
                `SELECT oi.*, f.name FROM order_items oi 
                 JOIN food_items f ON oi.food_item_id = f.id 
                 WHERE oi.order_id = ?`, [order.id]
            );
            order.items = items;
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

router.put('/orders/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Cập nhật trạng thái thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// --- 18. SUPPORT CALLS MANAGEMENT ---
router.get('/support', async (req, res) => {
    try {
        const [calls] = await db.query('SELECT * FROM support_calls WHERE status = "Chờ xử lý" ORDER BY created_at ASC');
        res.json(calls);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

router.put('/support/:id/resolve', async (req, res) => {
    try {
        await db.query('UPDATE support_calls SET status = "Đã hỗ trợ" WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xử lý yêu cầu' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// --- 15 & 16. MENU MANAGEMENT (CRUD) ---
router.post('/menu', async (req, res) => {
    try {
        const { category_id, name, description, price, image_url, tags } = req.body;
        await db.query(
            'INSERT INTO food_items (category_id, name, description, price, image_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
            [category_id, name, description, price, image_url, tags]
        );
        res.json({ message: 'Thêm món thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

router.put('/menu/:id', async (req, res) => {
    try {
        const { category_id, name, description, price, image_url, tags } = req.body;
        await db.query(
            'UPDATE food_items SET category_id=?, name=?, description=?, price=?, image_url=?, tags=? WHERE id=?',
            [category_id, name, description, price, image_url, tags, req.params.id]
        );
        res.json({ message: 'Cập nhật món thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

router.delete('/menu/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM food_items WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa món ăn' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// --- 19. TABLE MANAGEMENT (CRUD) ---
router.get('/tables', async (req, res) => {
    try {
        const [tables] = await db.query('SELECT * FROM restaurant_tables');
        res.json(tables);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});


router.post('/tables', async (req, res) => {
    try {
        const { table_number, area } = req.body;
        await db.query('INSERT INTO restaurant_tables (table_number, area) VALUES (?, ?)', [table_number, area]);
        res.json({ message: 'Thêm bàn thành công' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

router.delete('/tables/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM restaurant_tables WHERE id = ?', [req.params.id]);
        res.json({ message: 'Đã xóa bàn' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

// --- 20. ANALYTICS (Revenue & Popular Dishes) ---
router.get('/analytics', async (req, res) => {
    try {
        const [revenue] = await db.query(`
            SELECT DATE(created_at) as date, SUM(total_amount) as daily_total 
            FROM orders WHERE status = 'Đã thanh toán' 
            GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7
        `);
        
        const [popular] = await db.query(`
            SELECT f.name, SUM(oi.quantity) as total_sold 
            FROM order_items oi 
            JOIN food_items f ON oi.food_item_id = f.id 
            GROUP BY f.id ORDER BY total_sold DESC LIMIT 5
        `);
        
        res.json({ revenue, popular });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server', details: error.message });
    }
});

module.exports = router;

