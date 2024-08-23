# BBS-Proxy
日本向けに軽量化して作ったWEBProxyです。
## ~ 導入方法&起動方法 ~

```sudo curl -Ls https://raw.githubusercontent.com/uu5007mp/BBS-Proxy/main/set_pm2.sh -o set.sh```
```bash ./set.sh```

logの様子を見るには 

```pm2 logs bbs-proxy```

で見れます
### 終
## 止めるには
```pm2 stop bbs-proxy```
## 削除するには
```sudo curl -Ls https://raw.githubusercontent.com/uu5007mp/BBS-Proxy/main/delete.sh | sudo bash```
## 注意
~~debian linuxじゃないとできないです。(apt入れたらできるかも(試していません))~~

他のディストリビューションにも対応させました。

localhost以外はHTTPSじゃないと使えません。
## 使わせてもらったもの
Ultraviolet:https://github.com/titaniumnetwork-dev/Ultraviolet

© BlogBooks Community
