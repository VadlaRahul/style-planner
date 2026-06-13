USE styleplannerdb;

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    email         VARCHAR(255)  NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    full_name     VARCHAR(100)  NOT NULL,
    role          ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    is_verified   BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_profiles (
    id              BIGINT          NOT NULL AUTO_INCREMENT,
    user_id         BIGINT          NOT NULL,
    height_cm       DECIMAL(5,2)    NOT NULL,
    weight_kg       DECIMAL(5,2)    NOT NULL,
    body_type       ENUM('SLIM','AVERAGE','ATHLETIC','PLUS') NULL,
    skin_tone       VARCHAR(20)     NULL,
    selfie_path     VARCHAR(500)    NULL,
    avatar_config   JSON            NULL,
    preferred_style VARCHAR(50)     NULL,
    location_city   VARCHAR(100)    NULL,
    onboarding_done BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_profiles_user_id (user_id),
    CONSTRAINT fk_user_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS clothing_items (
    id                    BIGINT        NOT NULL AUTO_INCREMENT,
    user_id               BIGINT        NOT NULL,
    name                  VARCHAR(150)  NOT NULL,
    category              ENUM('TOP','BOTTOM','FOOTWEAR','OUTERWEAR','ACCESSORY') NOT NULL,
    brand                 VARCHAR(100)  NULL,
    color_primary         VARCHAR(20)   NULL,
    color_tags            JSON          NULL,
    style_tags            JSON          NULL,
    original_image_path   VARCHAR(500)  NOT NULL,
    processed_image_path  VARCHAR(500)  NULL,
    texture_map_path      VARCHAR(500)  NULL,
    drape_config          JSON          NULL,
    is_public             BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_clothing_items_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_clothing_user_id (user_id),
    INDEX idx_clothing_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfits (
    id              BIGINT        NOT NULL AUTO_INCREMENT,
    user_id         BIGINT        NOT NULL,
    name            VARCHAR(150)  NOT NULL,
    description     TEXT          NULL,
    occasion        VARCHAR(50)   NULL,
    weather_tag     VARCHAR(30)   NULL,
    thumbnail_path  VARCHAR(500)  NULL,
    is_favourite    BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_outfits_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_outfits_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS outfit_items (
    id                BIGINT  NOT NULL AUTO_INCREMENT,
    outfit_id         BIGINT  NOT NULL,
    clothing_item_id  BIGINT  NOT NULL,
    layer_order       INT     NOT NULL DEFAULT 0,
    position_override JSON    NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_outfit_clothing (outfit_id, clothing_item_id),
    CONSTRAINT fk_outfit_items_outfit
        FOREIGN KEY (outfit_id) REFERENCES outfits(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_outfit_items_clothing
        FOREIGN KEY (clothing_item_id) REFERENCES clothing_items(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_outfit_items_outfit_id (outfit_id),
    INDEX idx_outfit_items_clothing_id (clothing_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    user_id     BIGINT        NOT NULL,
    token       VARCHAR(512)  NOT NULL,
    expires_at  TIMESTAMP     NOT NULL,
    revoked     BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_refresh_token (token),
    CONSTRAINT fk_refresh_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_refresh_tokens_user_id (user_id),
    INDEX idx_refresh_tokens_token (token(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
