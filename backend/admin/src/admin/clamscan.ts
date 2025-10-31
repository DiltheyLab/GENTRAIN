import NodeClam from 'clamscan';
import Stream from 'stream';

export class ClamScan {
  static #instance: ClamScan;
  protected client: NodeClam | null;

  private constructor(client: NodeClam) {
    this.client = client;
  }

  public static instance = async () => {
    if (process.env.NODE_ENV != 'production') {
      ClamScan.#instance = new ClamScan(null);
    }
    if (!ClamScan.#instance) {
      try {
        const clamScanClient = await ClamScan.initClient();
        ClamScan.#instance = new ClamScan(clamScanClient);
      } catch (error) {
        throw error;
      }
    }

    return ClamScan.#instance;
  };

  protected static initClient = async () => {
    return await new NodeClam().init({
      clamdscan: {
        socket: '/run/clamav/clamd.sock',
      },
    });
  };

  public streamIsMalicious = async (stream: Stream) => {
    // We only scan malware in the production environment
    if (process.env.NODE_ENV != 'production') {
      return false;
    }
    const { isInfected } = await this.client.scanStream(stream);
    return isInfected;
  };
}
