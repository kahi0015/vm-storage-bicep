## Infrastructure Deployment

### Steps to Deploy on Azure VM

- Create a Storage Account + Blob Container in Azure
- Create a VM (B1s) with public IP and open port 3000 (or 80)

```bash
az login

az group create --name cst8912lab10-RG --location canadacentral

az deployment group create --resource-group cst8912lab10-RG --template-file main.bicep --parameters adminUsername=azureadmin adminPassword=Azure@User@2025!

az resource list --resource-group cst8912lab10-RG
```

- Upload a few blobs (files) to the container
- SSH into the VM
- Install Node.js:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs
```

- Upload project to the VM (SCP or git clone)

## Deploy via GitHub to Azure VM

- Push Node.js Project to GitHub

```bash
git init
git remote add origin https://github.com/kahi0015/vm-storage-bicep.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main --force
```

- Run:

```bash
npm install
npm start
```

- Access the VM’s public IP in browser

  http://<VM_PUBLIC_IP>:3000

## Cleanup Azure resources

```bash
az group delete --name cst8912lab10-RG
```
