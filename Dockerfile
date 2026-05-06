# ---- Этап 1: Сборка зависимостей и проекта ----
	FROM node:22-alpine AS builder

	# Установка системных зависимостей для сборки нативных модулей (например, sharp)
	RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git
	
	WORKDIR /app
	
	# Копируем файлы с зависимостями
	COPY package.json package-lock.json ./
	
	# Устанавливаем зависимости
	RUN npm ci --only=production && npm cache clean --force
	
	# Копируем остальной код проекта
	COPY . .
	
	# Сборка админ-панели Strapi
	RUN npm run build
	
	# ---- Этап 2: Финальный образ ----
	FROM node:22-alpine
	
	# Установка runtime-зависимостей для sharp
	RUN apk add --no-cache vips-dev
	
	WORKDIR /app
	
	# Копируем node_modules и собранные файлы из этапа builder
	COPY --from=builder /app/node_modules ./node_modules
	COPY --from=builder /app/dist ./dist
	COPY --from=builder /app/package.json ./
	COPY --from=builder /app/.env ./.env  # если используете .env файл
	
	# Копируем папку конфигураций (если она не была включена в сборку)
	COPY --from=builder /app/config ./config
	
	# Создаем пользователя с низкими привилегиями для безопасности
	RUN addgroup --system --gid 1001 nodejs && \
			adduser --system --uid 1001 strapi
	
	# Меняем владельца всех файлов на нового пользователя
	RUN chown -R strapi:nodejs /app
	
	# Переключаемся на пользователя strapi
	USER strapi
	
	# Открываем порт, который использует Strapi
	EXPOSE 1337
	
	# Команда для запуска приложения в production режиме
	CMD ["npm", "run", "start"]