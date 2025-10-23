import NodeClam from 'clamscan';
import { Readable } from 'stream';

export class ClamScan {
  static #instance: ClamScan;
  protected client: NodeClam;

  private constructor() {}

  public static instance = async () => {
    if (!ClamScan.#instance) {
      try {
        ClamScan.#instance = new ClamScan();
        await ClamScan.#instance.init();
      } catch (error) {
        ClamScan.#instance = undefined;
        throw error;
      }
    }

    return ClamScan.#instance;
  };

  protected init = async () => {
    this.client = await new NodeClam().init({
      clamdscan: {
        socket: '/run/clamav/clamd.sock',
      },
    });
  };

  public streamIsMalicious = async (stream: Readable) => {
    const { isInfected } = await this.client.scanStream(stream);
    return isInfected;
  };
}
