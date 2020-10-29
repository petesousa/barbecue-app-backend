import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterBarbecueOrganizerFromStringToId1603910162649
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('barbecue', 'organizer');
    await queryRunner.addColumn(
      'barbecue',
      new TableColumn({
        name: 'organizerId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'barbecue',
      new TableForeignKey({
        name: 'BarbecueOrganizerFK',
        columnNames: ['organizerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('barbecue', 'BarbecueOrganizerFK');

    await queryRunner.dropColumn('barbecue', 'organizerId');
    await queryRunner.addColumn(
      'barbecue',
      new TableColumn({
        name: 'organizer',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
