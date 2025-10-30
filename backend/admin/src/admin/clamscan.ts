import NodeClam from 'clamscan';
import Stream from 'stream';

export class ClamScan {
  static #instance: ClamScan;
  protected client: NodeClam;

  private constructor(client: NodeClam) {
    this.client = client;
  }

  public static instance = async () => {
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
    const { isInfected } = await this.client.scanStream(stream);
    return isInfected;
  };
}
