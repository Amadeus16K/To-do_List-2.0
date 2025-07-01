/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Habilita a extensão uuid-ossp se ela ainda não existir
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Cria a tabela de usuários
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Cria a tabela de tarefas
  await knex.schema.createTable('tasks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.text('description');
    table.string('status').defaultTo('pendente');
    table.string('priority').defaultTo('normal');
    table.date('due_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Chave estrangeira
    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Desfaz na ordem inversa da criação para evitar erros de chave estrangeira
  await knex.schema.dropTable('tasks');
  await knex.schema.dropTable('users');
}