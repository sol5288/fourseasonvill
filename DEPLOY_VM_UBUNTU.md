# Fourseason VM 배포 가이드 (Ubuntu + Docker + Caddy)

## 1) GCP VM 준비

- Ubuntu 22.04 LTS 권장
- 방화벽 인바운드 허용:
  - `80/tcp`
  - `443/tcp`
  - `22/tcp` (관리자 IP로 제한 권장)

## 2) 서버 패키지 설치

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

> `usermod` 적용을 위해 한 번 로그아웃/재로그인하세요.

## 3) 프로젝트 배치

```bash
cd /opt
sudo git clone <YOUR_REPOSITORY_URL> fourseason
sudo chown -R $USER:$USER /opt/fourseason
cd /opt/fourseason
cp .env.example .env
```

`.env` 값을 실제 도메인/이메일로 수정:

```env
DOMAIN=example.com
EMAIL=you@example.com
```

## 4) 서비스 기동

```bash
cd /opt/fourseason
docker compose up -d
docker compose ps
docker compose logs -f web
```

## 5) 업데이트 배포

```bash
cd /opt/fourseason
git pull origin main
docker compose up -d
```

## 6) 점검 포인트

- DNS A 레코드가 VM 외부 IP를 가리키는지 확인
- 최초 HTTPS 발급은 DNS 전파 후 수 분 소요될 수 있음
- 확인:
  - `https://<DOMAIN>` 접속
  - `docker compose logs --tail 100 web`
  - `curl -I https://<DOMAIN>`
  - `curl -I https://<DOMAIN>/.env` (반드시 `404` 또는 `403`이어야 함)
  - `curl -I https://<DOMAIN>/index.html` (`Cache-Control: no-cache` 확인)

## 7) 운영 권장

- SSH는 키 기반 인증 + 특정 IP 제한
- 정기 보안 업데이트 사용
- 주기적으로 `docker image prune -f` 실행해 디스크 관리
