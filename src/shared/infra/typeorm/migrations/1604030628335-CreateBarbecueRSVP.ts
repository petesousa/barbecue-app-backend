import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateBarbecueRSVP1604030628335
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'barbecue_rsvp',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'barbecueId',
            type: 'uuid',
          },
          {
            name: 'rsvp',
            type: 'boolean',
          },
          {
            name: 'willEat',
            type: 'boolean',
          },
          {
            name: 'willDrink',
            type: 'boolean',
          },
          {
            name: 'hasPaid',
            type: 'boolean',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'barbecue_rsvp',
      new TableForeignKey({
        name: 'RSVPBarbecueFK',
        columnNames: ['barbecueId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'barbecue',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'barbecue_rsvp',
      new TableForeignKey({
        name: 'RSVPUserFK',
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('barbecue_rsvp', 'RSVPUserFK');
    await queryRunner.dropForeignKey('barbecue_rsvp', 'RSVPBarbecueFK');
    await queryRunner.dropTable('barbecue_rsvp');
  }
}
