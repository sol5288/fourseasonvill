# Fourseason VM 배포 가이드 (Ubuntu + Docker + Caddy)

## 1) GCP VM 준비

- Ubuntu 24.04/26.04 LTS 계열 권장
- 방화벽 인바운드 허용:
  - `80/tcp`
  - `443/tcp`
  - `22/tcp` (관리자 IP로 제한 권장)
- DNS:
  - `A` 레코드 `fourseasonvill.kr -> VM 공인 IP` 미리 설정 권장

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

> `usermod` 적용을 위해 SSH 세션을 종료하고 다시 접속하세요.

재접속 후 확인:

```bash
id
docker ps
docker compose version
```

## 3) 프로젝트 배치

권한 이슈가 없으면 `/opt` 사용:

```bash
cd /opt
sudo git clone https://github.com/sol5288/fourseasonvill.git fourseason
sudo chown -R $USER:$USER /opt/fourseason
cd /opt/fourseason
```

`/opt`에 권한이 없거나 sudo가 제한된 환경이면 홈 디렉터리 사용:

```bash
cd ~
git clone https://github.com/sol5288/fourseasonvill.git fourseason
cd ~/fourseason
```

## 4) 환경변수 설정 (`.env`)

최소 이미지에서 `nano`/`vi`가 없을 수 있으므로 아래 방식 권장:

```bash
cat > .env <<'EOF'
DOMAIN=fourseasonvill.kr
EMAIL=send@yzpalmistry.com
EOF
```

확인:

```bash
cat .env
```

## 5) 서비스 기동

```bash
docker compose up -d
docker compose ps
docker compose logs --tail 100 web
```

## 6) 업데이트 배포

`/opt` 배포 시:

```bash
cd /opt/fourseason
git pull origin main
docker compose up -d
```

`~/fourseason` 배포 시:

```bash
cd ~/fourseason
git pull origin main
docker compose up -d
```

## 7) 점검 포인트

- 기본 동작 확인:
  - `https://<DOMAIN>` 접속
  - `docker compose logs --tail 100 web`
  - `curl -I https://<DOMAIN>`
  - `curl -I https://<DOMAIN>/.env` (반드시 `404` 또는 `403`)
  - `curl -I https://<DOMAIN>/index.html` (`Cache-Control: no-cache` 확인)

- DNS/인증서 확인:
  - `curl -4 ifconfig.me` (현재 VM 공인 IP)
  - `getent hosts <DOMAIN>` (도메인 해석 IP)
  - 두 IP가 다르면 인증서 발급 실패 가능성 높음

## 8) 트러블슈팅

- `sudo: I'm sorry ... I'm afraid I can't do that`
  - OS Login/IAM 권한 이슈 가능성
  - 임시로 `~/fourseason` 경로 배포 사용

- `permission denied while trying to connect to /var/run/docker.sock`
  - `id`에 `docker` 그룹이 있는지 확인
  - 없으면 관리자 권한으로 `usermod -aG docker <user>` 후 재로그인

- ACME 발급 실패 (`http-01 503`, `tls-alpn-01` 실패)
  - 도메인이 현재 VM으로 라우팅되는지 확인
  - Cloudflare 사용 시 최초 발급은 DNS only 모드 권장
  - 발급 재시도: `docker compose restart web && docker compose logs -f web`

## 9) 운영 권장

- SSH는 키 기반 인증 + 특정 IP 제한
- 정기 보안 업데이트 사용
- 주기적으로 `docker image prune -f` 실행해 디스크 관리
