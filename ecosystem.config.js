module.exports = {
  apps: [{
    name: 'bluelobsters',
    script: 'server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced features
    watch: false,
    ignore_watch: ['node_modules', 'logs', 'database'],
    watch_options: {
      followSymlinks: false
    },
    
    // Restart configuration
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Memory management
    max_memory_restart: '1G',
    
    // Health monitoring
    health_check_http: {
      url: 'http://localhost:3000/api/health',
      interval: '30s',
      timeout: '10s'
    }
  }]
};