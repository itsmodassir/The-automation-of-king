
import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';
import { DataSource } from 'typeorm';
import { AdminUser, AdminRole } from '../src/admin/entities/admin-user.entity';

// Initialize DataSource with environment configuration
const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [AdminUser],
    synchronize: false,
    migrations: ['src/database/migrations/*.ts'],
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const prompt = (question: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

async function seed() {
    try {
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('✓ Database connection established');
        }

        const adminRepo = AppDataSource.getRepository(AdminUser);

        // Check if admin already exists
        const adminCount = await adminRepo.count();
        if (adminCount > 0) {
            console.log('⚠️  Admin users already exist in the database.');
            const response = await prompt('Do you want to create another admin? (yes/no): ');
            if (response.toLowerCase() !== 'yes') {
                console.log('Exiting...');
                await AppDataSource.destroy();
                process.exit(0);
            }
        }

        // Get admin credentials from user input
        console.log('\n📝 Create Super Admin Account\n');
        const email = await prompt('Email address: ');
        const password = await prompt('Password: ');
        const confirmPassword = await prompt('Confirm password: ');

        if (password !== confirmPassword) {
            console.error('✗ Passwords do not match!');
            await AppDataSource.destroy();
            process.exit(1);
        }

        if (password.length < 8) {
            console.error('✗ Password must be at least 8 characters long!');
            await AppDataSource.destroy();
            process.exit(1);
        }

        // Check if email already exists
        const existing = await adminRepo.findOne({ where: { email } });
        if (existing) {
            console.error('✗ Email already registered as admin!');
            await AppDataSource.destroy();
            process.exit(1);
        }

        // Create new admin
        console.log('\n⏳ Creating Super Admin...');
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);

        const admin = adminRepo.create({
            email,
            passwordHash: hash,
            role: AdminRole.SUPER_ADMIN,
            isActive: true,
        });

        await adminRepo.save(admin);
        console.log('\n✅ Super Admin created successfully!');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   ID: ${admin.id}`);

        await AppDataSource.destroy();
        process.exit(0);
    } catch (error) {
        console.error('\n✗ Error creating admin:', error.message);
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        process.exit(1);
    } finally {
        rl.close();
    }
}

seed();
