const { db } = require('./db');
const nodemailer = require('nodemailer');

function runDailyTask(targetHour, targetMinute) {
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute);

    if (target < now) {
        target.setDate(target.getDate() + 1);
    }

    const timeoutDuration = target - now;

    setTimeout(() => {
        checkReadyStatus();

        console.log(`Task executed at: ${new Date()}`);

        runDailyTask(targetHour, targetMinute);
    }, timeoutDuration);
}



async function sendEmailNotification(email, message) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // pt yahoo si gmail
        secure: false, // true for SSL si false for TLS
        auth: {
            user: 'myplant.contact@gmail.com',
            pass: 'svpg abft xwjb ogyk'
        }
    });

    let info = await transporter.sendMail({
        from: '"myPlant" <myplant.contact@gmail.com>', 
        to: email,
        subject: 'Notification from myPlant',
        text: message,
        html: `<b>${message}</b>`
    });

    console.log('Email notification sent: %s', info.messageId);
}


async function getUserEmail(userId) {
    try {
        const query = 'SELECT email FROM users WHERE id = $1';
        const values = [userId];

        const res = await db.query(query, values);
        return res.rows.length ? res.rows[0].email : null;
    } catch (err) {
        console.error('Error fetching user email', err.stack);
        return null;
    }
}


async function insertNotification(userId, message) {
    try {
        const query = 'INSERT INTO notifications (user_id, message) VALUES ($1, $2) RETURNING *';
        const values = [userId, message];

        const res = await db.query(query, values);
        console.log('Notification inserted:', res.rows[0]);
    } catch (err) {
        console.error('Error inserting notification', err.stack);
    }
}

async function checkReadyStatus() {
    try {
        const query = 'SELECT * FROM cultures WHERE ready = true';
        const res = await db.query(query);

        for (let purchase of res.rows) {
            const userId = purchase.user_id;
            const userEmail = await getUserEmail(userId);
            const message = `Your purchase interest is ready!`;

            if (userEmail) {
                await sendEmailNotification(userEmail, message);
                await insertNotification(userId, message);
            } else {
                console.log(`No email found for user ${userId}`);
            }
        }
    } catch (err) {
        console.error('Error executing query', err.stack);
    }
}


runDailyTask(1, 50);

// const testEmail = 'alina@gmail.com';
// const testMessage = 'This is a test notification from myPlant.';

// sendEmailNotification(testEmail, testMessage)
//     .then(() => console.log('Test email sent successfully.'))
//     .catch(error => console.error('Error sending test email:', error));