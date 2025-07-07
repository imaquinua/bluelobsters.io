#!/bin/bash

# BlueLobsters Database Backup Script
# Schedule with cron: 0 2 * * * /path/to/backup.sh

BACKUP_DIR="./backups"
DB_FILE="./database/users.db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/users_backup_$DATE.db"

echo "🗄️  BlueLobsters Database Backup"
echo "================================"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if database file exists
if [ ! -f "$DB_FILE" ]; then
    echo "❌ Database file not found: $DB_FILE"
    exit 1
fi

# Create backup
echo "📦 Creating backup: $BACKUP_FILE"
cp "$DB_FILE" "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully"
    
    # Compress backup
    gzip "$BACKUP_FILE"
    echo "🗜️  Backup compressed: $BACKUP_FILE.gz"
    
    # Get backup size
    BACKUP_SIZE=$(ls -lh "$BACKUP_FILE.gz" | awk '{print $5}')
    echo "📊 Backup size: $BACKUP_SIZE"
    
    # Clean old backups (keep last 30 days)
    echo "🧹 Cleaning old backups (keeping last 30 days)..."
    find "$BACKUP_DIR" -name "users_backup_*.db.gz" -mtime +30 -delete
    
    # Count remaining backups
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/users_backup_*.db.gz 2>/dev/null | wc -l)
    echo "📁 Total backups: $BACKUP_COUNT"
    
    echo "✅ Backup process completed successfully"
else
    echo "❌ Backup failed"
    exit 1
fi