import fs from "fs";
import path from "path";

type LatLng = { lat: number; lng: number };

const GEO_PATH = path.resolve(
  process.cwd(),
  "src/utils/cidades.json"
);

export class GeoService {
  private loadData(): any {
    if (!fs.existsSync(GEO_PATH)) {
      fs.mkdirSync(path.dirname(GEO_PATH), { recursive: true });
      fs.writeFileSync(GEO_PATH, JSON.stringify({}, null, 2));
    }

    return JSON.parse(fs.readFileSync(GEO_PATH, "utf-8"));
  }

  private saveData(data: any) {
    fs.writeFileSync(GEO_PATH, JSON.stringify(data, null, 2));
  }

  async getLatLng(estado: string, cidade: string): Promise<LatLng | null> {
    const data = this.loadData();

    // 1️⃣ procura no cache local
    if (data[estado]?.[cidade]) {
      return data[estado][cidade];
    }

    // 2️⃣ fallback → Nominatim
    const coords = await this.fetchFromNominatim(estado, cidade);
    if (!coords) return null;

    // 3️⃣ salva no arquivo
    if (!data[estado]) data[estado] = {};
    data[estado][cidade] = {
      ...coords,
      source: "nominatim",
    };

    this.saveData(data);

    return coords;
  }

  private async fetchFromNominatim(
    estado: string,
    cidade: string
  ): Promise<LatLng | null> {
    console.log('BUSCOUUUU')
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      cidade
    )}&state=${encodeURIComponent(
      estado
    )}&country=Brazil&format=jsonv2&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "SeuApp/1.0 (contato@seusite.com)",
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    if (!json.length) return null;

    return {
      lat: Number(json[0].lat),
      lng: Number(json[0].lon),
    };
  }
}
