const tableName = 'notify_templates'

export function up(knex) {
  return knex.schema
    .withSchema('water')
    .createTable(tableName, (table) => {
      // Primary Key
      table.string('message_ref').notNullable().primary()

      // Data
      table.string('template_id').notNullable()
      table.string('notes')
      table.string('notify_key')
    })
    .then(() => {
      // Matches the rows accumulated by the original production migrations in water-abstraction-service:
      // migrations/sqls/20180119092223-notify-up.sql
      // migrations/sqls/20180119122037-more-notify-templates-up.sql
      // migrations/sqls/20180214094533-scheduled-notifications-up.sql
      // migrations/sqls/20180215105218-unit-tests-up.sql
      // migrations/sqls/20180312121815-remove-notify-keys-up.sql (normalises the notify_key values used below)
      // migrations/sqls/20180518142203-notification-templates-up.sql
      // migrations/sqls/20180927140513-add-return-invite-letter-up.sql
      // migrations/sqls/20190116170936-add-final-return-reminder-notify-template-up.sql
      return knex('notify_templates')
        .withSchema('water')
        .insert([
          {
            message_ref: 'share_new_user',
            template_id: '145e2919-da41-4f4d-9570-17f5bb12f119',
            notify_key: 'live'
          },
          {
            message_ref: 'share_existing_user',
            template_id: '725e399e-772b-4c91-835b-68f4995ab6ff',
            notify_key: 'live'
          },
          {
            message_ref: 'security_code_letter',
            template_id: 'd48d29cc-ed03-4a01-b496-5cce90beb889',
            notify_key: 'test'
          },
          {
            message_ref: 'existing_user_verification_email',
            template_id: 'd9654596-a533-47e9-aa27-2cf869c6aa13',
            notify_key: 'live'
          },
          {
            message_ref: 'new_user_verification_email',
            template_id: '3d25b496-abbd-49bb-b943-016019082988',
            notify_key: 'live'
          },
          {
            message_ref: 'password_locked_email',
            template_id: '985907b6-8930-4985-9d27-17369b07e22a',
            notify_key: 'live'
          },
          {
            message_ref: 'password_reset_email',
            template_id: 'a699123a-fa28-4938-8d64-5729a36f4437',
            notify_key: 'live'
          },
          {
            message_ref: 'expiry_notification_email',
            template_id: '03772305-d22a-41f8-b643-7b982af549af',
            notify_key: 'whitelist'
          },
          {
            message_ref: 'unit_test_email',
            template_id: '8ac8a279-bf93-44da-b536-9b05703cb928',
            notify_key: 'test'
          },
          {
            message_ref: 'unit_test_missing_in_notify',
            template_id: 'abcd',
            notify_key: 'test'
          },
          {
            message_ref: 'unit_test_sms',
            template_id: '40d9ef2d-ecd0-4ed8-9703-b9863948ea6c',
            notify_key: 'test'
          },
          {
            message_ref: 'unit_test_letter',
            template_id: '7ed9c13b-6f93-4c2a-8522-b17b07aa6496',
            notify_key: 'test'
          },
          {
            message_ref: 'notification_email',
            template_id: '59bc02ba-a37e-4aa8-a434-573fb85c58e1',
            notify_key: 'test'
          },
          {
            message_ref: 'notification_letter',
            template_id: 'c4b1f147-e357-4f81-b19e-fa686e05a9b1',
            notify_key: 'test'
          },
          {
            message_ref: 'returns_invitation_letter',
            template_id: 'd31d05d3-66fe-4203-8626-22e63f9bccd6',
            notify_key: 'test'
          },
          {
            message_ref: 'returns_final_reminder',
            template_id: '5d8d9fca-34ef-44bd-b5fe-fe325e8870c7',
            notify_key: 'test'
          }
        ])
    })
}

export function down(knex) {
  return knex.schema.withSchema('water').dropTableIfExists(tableName)
}
