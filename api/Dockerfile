# syntax=docker/dockerfile:1.7

# --- deps stage: install PHP deps with Composer (no-dev) ---
FROM composer:2.8 AS deps
WORKDIR /app

# Leverage Docker cache by copying only manifests first
COPY ./composer.json ./composer.lock ./
RUN composer install --no-dev --prefer-dist --no-progress --no-interaction --optimize-autoloader --no-scripts --ignore-platform-req=ext-gd

# --- base php-fpm runtime ---
FROM php:8.3-fpm-alpine AS base
WORKDIR /var/www/html

# Install system packages and PHP extensions required by Laravel
RUN set -eux; \
    apk add --no-cache \
      bash shadow \
      tzdata \
      icu icu-dev \
      oniguruma-dev \
      libzip-dev \
      freetype-dev libjpeg-turbo-dev libpng-dev \
      curl git \
      mariadb-client; \
    docker-php-ext-configure intl; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j"$(nproc)" intl pdo_mysql bcmath exif pcntl zip; \
    docker-php-ext-install -j"$(nproc)" gd; \
    apk del --no-network icu-dev oniguruma-dev libzip-dev || true

# Opcache for prod
RUN docker-php-ext-enable opcache

# Create user to avoid running as root
RUN addgroup -S app && adduser -S app -G app

# --- app stage: copy code and built vendor ---
FROM base AS app

COPY --chown=app:app . .
COPY --from=deps /app/vendor ./vendor

# Ensure storage/bootstrap perms
RUN set -eux; \
    mkdir -p storage bootstrap/cache; \
    chown -R app:app storage bootstrap/cache; \
    chmod -R ug+rwX storage bootstrap/cache

USER app

# Pre-warm caches (won't fail if no env yet)
# Discover packages after vendor is present
RUN php artisan package:discover --ansi || true \
 && php artisan config:clear || true \
 && php artisan route:clear || true \
 && php artisan view:clear || true

EXPOSE 9000
CMD ["php-fpm", "-F"]
