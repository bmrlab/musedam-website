import * as migration_20241202_093459 from './20241202_093459';
import * as migration_20250728_032643_article_properties from './20250728_032643_article_properties';
import * as migration_20250731_112044_i18n from './20250731_112044_i18n';
import * as migration_20250801_072637_image_prefix from './20250801_072637_image_prefix';
import * as migration_20250805_074112_schedule from './20250805_074112_schedule';
import * as migration_20250820_111040_help_center from './20250820_111040_help_center';
import * as migration_20250928_091320_update_to_3_57_0 from './20250928_091320_update_to_3_57_0';

export const migrations = [
  {
    up: migration_20241202_093459.up,
    down: migration_20241202_093459.down,
    name: '20241202_093459',
  },
  {
    up: migration_20250728_032643_article_properties.up,
    down: migration_20250728_032643_article_properties.down,
    name: '20250728_032643_article_properties',
  },
  {
    up: migration_20250731_112044_i18n.up,
    down: migration_20250731_112044_i18n.down,
    name: '20250731_112044_i18n',
  },
  {
    up: migration_20250801_072637_image_prefix.up,
    down: migration_20250801_072637_image_prefix.down,
    name: '20250801_072637_image_prefix',
  },
  {
    up: migration_20250805_074112_schedule.up,
    down: migration_20250805_074112_schedule.down,
    name: '20250805_074112_schedule',
  },
  {
    up: migration_20250820_111040_help_center.up,
    down: migration_20250820_111040_help_center.down,
    name: '20250820_111040_help_center',
  },
  {
    up: migration_20250928_091320_update_to_3_57_0.up,
    down: migration_20250928_091320_update_to_3_57_0.down,
    name: '20250928_091320_update_to_3_57_0'
  },
];
