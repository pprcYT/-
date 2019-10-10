# 알파끄투

**내 작은 글자 놀이터, 알파끄투.**

[알파끄투](https://alphakkutu.me)는 [쪼리핑](http://blog.jjo.kr)님의 [끄투](https://github.com/JJoriping/KKuTu)를 기반으로 하는 웹 단어 게임입니다.

혼자서, 또는 친구들과 함께 간단하고 빠르게 즐길 수 있는 게임입니다. 

## 설치

### Windows 환경
1. 이 레포지토리를 내려받습니다.
1. [node.js](https://nodejs.org/ko/) 인스톨러를 내려받아 설치(버전 6 이상)합니다. [npm](https://www.npmjs.com/)과 함께 설치되어야 합니다.
1. 명령 프롬프트에서 `npm install -g grunt grunt-cli`를 입력해 [grunt](https://gruntjs.com/)를 설치합니다.
1. [PostgreSQL](https://www.postgresql.org/) 인스톨러를 내려받아 *pgAdmin*(자동으로 설치됨)과 함께 설치합니다.
1. *pgAdmin*을 실행시키고 SQL 파일(`./db.sql`)을 데이터베이스에 입력시킵니다.
	* 자세한 과정은 [개발자 블로그][dev-blog]를 참고하세요.
1. 배치 파일(`./server-setup.bat`)을 실행시킵니다.
1. 배치 파일(`./Server/run.bat`)을 실행시킵니다.
	* 되도록 이 배치 파일을 직접 종료하지 말고 이를 실행시켜 나타나는 창을 종료하세요.

### Linux 환경
1. 이 레포지토리를 내려받습니다.
1. 패키지 매니저를 이용하여 [node.js](https://nodejs.org/)와 [npm](https://www.npmjs.com/)을 설치(버전 6 이상)합니다.
1. `npm install -g grunt grunt-cli`를 입력해 [grunt](https://gruntjs.com/)를 설치합니다.
1. 패키지 매니저를 이용하여 [PostgreSQL](https://www.postgresql.org/)과 *psql*을 설치합니다.
1. SQL 파일(`./db.sql`)을 데이터베이스에 입력시킵니다.
	1. 명령어를 다음 예와 같이 입력할 수 있습니다: `sudo -u postgres psql --quiet main < ./db.sql`
1. 섈 스크립트 파일(`./server-setup.bat`)을 실행시킵니다. (Windows 전용 파일이지만 Linux에서도 작동합니다.)
1. 경로 `./Server`에서 다음 명령어들을 차례대로 실행합니다:
	1. (게임 서버) `node lib/Game/cluster.js 0 1`
	1. (웹 서버) `node lib/Web/cluster.js 1`

## 공통

- PostgreSQL 데이터베이스 서버에 접속하기 위해 설정 파일(`./Server/lib/sub/global.json`)에서 `PG_PASS` 값을 **반드시** 수정해야 합니다.
- 폴더 `./Server/lib/sub`에 oAuth 설정 파일(`auth.json`)과 전역 설정 파일(`global.json`)을 **반드시** 만들어 주세요. 본 레포지토리에는 각 파일의 양식이 들어가 있습니다.
- 본 레포지토리에는 [WordNet](https://wordnet.princeton.edu/) 자료가 포함되어 있습니다. 서버를 운영할 때 반드시 사용자에게 이에 대한 라이선스를 안내해야 합니다.
- 호스트 `127.0.0.2`는 웹 서버와 게임 서버 사이의 연결을 위해 예약된 주소이므로 이 주소를 사용하지 말아야 합니다.
- 서버가 정상적으로 설치된 다음부터는 서버를 실행시키기 위해서 가장 마지막 단계만 수행하면 됩니다.
- 서버가 성공적으로 열린 후 웹 브라우저에서 `127.0.0.1`(다른 사람들은 해당 컴퓨터의 외부 IP 주소)로 접속하여 끄투를 즐길 수 있습니다.
- 랭킹 및 세션 기능 일부는 [Redis](https://redis.io/) 서버가 실행되어야만 작동합니다. 일단 이를 설치하지 않아도 서버가 작동할 수 있도록 조치했습니다.
- [Cloudflare](https://www.cloudflare.com/)를 이용하는 경우, DNS 탭의 status를 `DNS only`로 두세요. `DNS and HTTP proxy (CDN)`으로 둘 경우, 방 만들기와 방 입장이 불가합니다.

## 기여하기

- 풀 리퀘스트(Pull Request)는 언제나 환영입니다. 알파끄투가 발전할 수 있도록 도와주십시요!
- 알파끄투 소스의 핵심 부분 수정을 원하신다면, 먼저 이슈(Issue)를 열어 대화를 나눠보세요.
- 풀 리퀘스트(Pull Request)의 문제가 없는지 먼저 확인해주시고 열어주세요.

## 라이센스

- 모든 소스 코드에 대해: [GNU 아페로 일반 공중 사용 허가서](https://github.com/AlphaKKuTu/KKuTu/blob/production/LICENSE)
- 모든 이미지 및 소리에 대해: [크리에이티브 커먼즈 라이선스 CC BY](https://creativecommons.org/licenses/by/4.0/)
	- 다만 본 레포지토리에서 제공하는 소스 코드로 끄투 서비스를 운영하기 위해 이들을 사용하는 경우 저작자 표시(BY)를 생략할 수 있습니다.
