A Helm chart for deploying the MuseDAM website.

```bash
helm install musedam-website ./ -f values.yaml -f secrets/values.cn.yaml --kube-context muse-aws-cn-prod
helm install musedam-website ./ -f values.yaml -f secrets/values.us.yaml --kube-context muse-aws-us-prod
# helm install musedam-website ./ -f values.yaml -f secrets/values.yaml --kube-context muse-azure-cn-prod
```

```bash
helm upgrade musedam-website ./ -f values.yaml -f secrets/values.cn.yaml --kube-context muse-aws-cn-prod
helm upgrade musedam-website ./ -f values.yaml -f secrets/values.us.yaml --kube-context muse-aws-us-prod
# helm upgrade musedam-website ./ -f values.yaml -f secrets/values.yaml --kube-context muse-azure-cn-prod
```
