import { createClient } from 'redis';

// Create a Redis client class to manage the connection
class RedisClient {
  private static instance: ReturnType<typeof createClient>;

  public static async getInstance() {
    if (!this.instance) {
      // Get Redis URL from environment variables, fallback to localhost if not set
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.instance = createClient({
        url: redisUrl
      });

      // Handle connection events
      this.instance.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      this.instance.on('connect', () => {
        console.log('Redis Client Connected');
      });

      // Connect to Redis
      await this.instance.connect();
    }

    return this.instance;
  }
}

export default RedisClient;