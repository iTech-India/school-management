import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailVerification1700000000001 implements MigrationInterface {
  name = 'AddEmailVerification1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "emailVerified" boolean DEFAULT false,
      ADD COLUMN "verificationToken" varchar,
      ADD COLUMN "verificationTokenExpiry" timestamp
    `);

    // Set existing users as email verified (for backward compatibility)
    await queryRunner.query(`
      UPDATE "users" SET "emailVerified" = true WHERE "role" IN ('admin', 'teacher')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      DROP COLUMN "emailVerified",
      DROP COLUMN "verificationToken",
      DROP COLUMN "verificationTokenExpiry"
    `);
  }
}

