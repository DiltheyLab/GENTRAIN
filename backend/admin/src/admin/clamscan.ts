import NodeClam from 'clamscan';
import { Readable } from 'stream';

export class ClamScan {
  static #instance: ClamScan;
  protected client: NodeClam;

  private constructor() {}

  public static instance = async () => {
    if (!ClamScan.#instance) {
      ClamScan.#instance = new ClamScan();
      await ClamScan.#instance.init();
    }

    return ClamScan.#instance;
  };

  protected init = async () => {
    try {
      this.client = await new NodeClam().init({
        clamdscan: {
          socket: '/run/clamav/clamd.sock',
        },
      });
    } catch (error) {
      console.error('Failed to initialize ClamScan:', error);
    }
  };

  public streamIsMalicious = async (stream: Readable) => {
    const { isInfected } = await this.client.scanStream(stream);
    return isInfected;
  };
}
