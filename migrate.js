const db = require('./backend/config/db');

async function migrate() {
    try {
        console.log('--- Migrating Database ---');
        
        // 1. Create reviews table
        await db.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                food_item_id INT NOT NULL,
                customer_name VARCHAR(100) DEFAULT 'Khách hàng',
                rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE CASCADE
            )
        `);
        console.log('✔ Table "reviews" created.');

        // 2. Insert dummy reviews if empty
        const [rows] = await db.query('SELECT COUNT(*) as count FROM reviews');
        if (rows[0].count === 0) {
            await db.query(`
                INSERT INTO reviews (food_item_id, customer_name, rating, comment) VALUES 
                (1, 'Thanh Trực', 5, 'Salad rất tươi, sốt chanh leo ngon tuyệt!'),
                (3, 'Minh Quân', 4, 'Bò bít tết mềm, nước sốt hơi đậm đà xíu.'),
                (6, 'Hồng Hạnh', 5, 'Trà đào rất thơm, miếng đào to và giòn.')
            `);
            console.log('✔ Dummy reviews inserted.');
        }

        // 3. Create admins table
        await db.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'staff') DEFAULT 'staff',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✔ Table "admins" created.');

        // 4. Insert dummy admin if empty (password: admin123)
        const [adminRows] = await db.query('SELECT COUNT(*) as count FROM admins');
        if (adminRows[0].count === 0) {
            await db.query(`
                INSERT INTO admins (username, password, role) VALUES 
                ('admin', 'admin123', 'admin'),
                ('staff', 'staff123', 'staff')
            `);
            console.log('✔ Dummy admins inserted.');
        }

        console.log('--- Migration Finished ---');

        process.exit(0);
    } catch (error) {
        console.error('✖ Migration failed:', error);
        process.exit(1);
    }
}

migrate();
