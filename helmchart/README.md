A Helm chart for deploying the MuseDAM website.

```bash
helm install musedam-website ./ -f values.yaml -f secrets/values.yaml --kube-context muse-azure-cn-prod
```

```bash
helm upgrade musedam-website ./ -f values.yaml -f secrets/values.yaml --kube-context muse-azure-cn-prod
```
