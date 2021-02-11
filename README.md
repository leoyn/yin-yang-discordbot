# Setup

## Development

```bash
DISCORD_TOKEN=xxx docker-compose up -d
```

## Production

1. Build images and push

```bash
docker buildx bake --set "*.platform=linux/arm/v7" --push
```

2. Deploy

```bash
export DISCORD_TOKEN=xxx

kubectl apply -f deployment/namespace.yaml
kubectl apply -f deployment/registrypullsecret.yaml
envsubst < deployment/bot-deployment.yaml | kubectl apply -f -
kubectl apply -f deployment/database-claim0-persistentvolumeclaim.yaml
kubectl apply -f deployment/database-deployment.yaml
```
