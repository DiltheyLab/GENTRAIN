# 🧬 GENTRAIN

GENTRAIN is an **innovative software designed for genetic-based infection chain tracing**. It was developed at the University Hospital Düsseldorf as part of a research project commissioned by the Ministry of Labor, Health and Social Affairs of North Rhine-Westphalia, Germany, and funded by the European Union (NextGenerationEU). The primary goal is to assist public health authorities in **better understanding infection chains in outbreak scenarios and the general population**. This significantly contributes to infection control and simultaneously promotes a sustainable increase in the digital maturity of the public health authorities, especially in the dimensions of software, data, and interoperability.

---

## 🚀 Features

- 📊 Interactive data visualization
- 🧬 Dedicated modul for complex outbreak analysis
- 🧠 Combines epidemiological and genetic data to trace infection chains effectively
- 🧩 Modular architecture (API, Frontend, Admin Panel, Documentation)
- 📦 Docker-based deployment for development and production
- 🔒 Role-based authentication and easy pathogen management for admins
- 📚 Interactive tutorial and comprehensive documentation in english and german for easy setup and usage

and many more...

---

## 🛠️ Quick Start

You can run GENTRAIN locally using Docker Compose:

```bash
git clone https://github.com/DiltheyLab/GENTRAIN.git
cd GENTRAIN
cp .env.example .env
docker compose -f docker-compose.dev.yaml up -d
cd frontend
npm install && npm run dev
```

Then open the frontend at:

➡️ http://localhost:3000

---

## 📚 Documentation

Full setup, configuration, and architecture details are available in the documentation:

👉 **[GENTRAIN Documentation](https://docs.gentrain.bi.denbi.de)**  
or in the `/documentation` directory of this repository.

Key sections include:

- [Getting Started](https://docs.gentrain.bi.denbi.de/docs/development/getting-started)
- [Deployment](https://docs.gentrain.bi.denbi.de/docs/development/deployment)
- [Dashboard](https://docs.gentrain.bi.denbi.de/docs/application/dashboard)
- [Admin Guide](https://docs.gentrain.bi.denbi.de/docs/admin/general)

---

## ⚙️ Deployment Options

- **Development:** `docker-compose.dev.yaml`
- **Production:** `docker-compose.prod.yaml` + Caddy (with HTTPS)
- **Automated CI/CD:** via GitHub Actions (`.github/workflows/prod_deployment.yml`)

---

## 🛡️ License

GENTRAIN is open-source software released under the **MIT License**.  
See [LICENSE](LICENSE) for details.

---

## 📫 Contact

- **Website:** [https://gentrain.bi.denbi.de](https://gentrain.bi.denbi.de)
- **Documentation:** [https://docs.gentrain.bi.denbi.de](https://docs.gentrain.bi.denbi.de)
- **Developers:** Sebastian Fuchs, Ben Kräling, Nils Lüschow, Johannes Ptok, Philipp Vogel, Jonas Weber
