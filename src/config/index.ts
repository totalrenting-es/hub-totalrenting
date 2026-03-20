export class Config {
  // Server
  public nodeEnv: string;
  public port: number;
  public host: string;
  public apiPrefix: string;

  // Alphabet
  public alphabet: {
    apiUrl: string;
  };

  // Vixiees Webhook Destinations
  public vixiees: {
    totalrenting: {
      destinations: string[];
    };
    twipo: {
      destinations: string[];
    };
  };

  constructor() {
    // Server
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.port = parseInt(process.env.PORT || '3002', 10);
    this.host = process.env.HOST || '0.0.0.0';
    this.apiPrefix = process.env.API_PREFIX || '/api';

    // Alphabet
    this.alphabet = {
      apiUrl: process.env.ALPHABET_API_URL || ''
    };

    // Vixiees Webhook Destinations (comma-separated URLs)
    this.vixiees = {
      totalrenting: {
        destinations: this.parseDestinations(process.env.VIXIEES_TOTALRENTING_DESTINATIONS || '')
      },
      twipo: {
        destinations: this.parseDestinations(process.env.VIXIEES_TWIPO_DESTINATIONS || '')
      }
    };
  }

  private parseDestinations(envValue: string): string[] {
    return envValue
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}

const config = new Config();
export default config;
