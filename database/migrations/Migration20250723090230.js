'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20250723090230 extends Migration {

  async up() {
    this.addSql(`create table \`aris_corp_application\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`channel_id\` text not null, \`user_id\` text not null, \`embed_message_id\` text not null, \`status\` text not null default 'OPEN');`);
  }

}
exports.Migration20250723090230 = Migration20250723090230;
