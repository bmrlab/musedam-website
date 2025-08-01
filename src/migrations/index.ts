import * as migration_20241202_093459 from './20241202_093459';
import * as migration_20250728_032643_article_properties from './20250728_032643_article_properties';
import * as migration_20250731_112044_i18n from './20250731_112044_i18n';
import * as migration_20250801_072637_image_prefix from './20250801_072637_image_prefix';

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
    name: '20250801_072637_image_prefix'
  },
];
