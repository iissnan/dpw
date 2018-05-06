---
title: Introduction to Servus
date: 2016-09-27 17:36:34
thumbnail: servus.jpg
---

<h2 id="motivation">动机</h2>

随着项目的开发，项目的文件也越来越多，DPW现在使用的 Grunt 开发方案反应越来越迟钝。DPW  的前端构建包含两个阶段，第一个阶段是将站点间共享的内容与站点所属的内容合并到 Stage 目录；第二阶段在 Stage 目录将进行构建并生成最终部署文件到服务器目录下。两个阶段皆需要 Watcher: 第一阶段的源码变动将会触发一次复制到 Stage 目录，而第二阶段定变动将会再次执行构建。

这个构建过程的主要问题体现在以下两个方面：

- 第一阶段的复制合并需要的时间随着项目的扩大越来越长
- 文件越来越多导致 Watcher 的负担越重，第一阶段源码文件的一次改动将会致使第二阶段的 Watcher 重新扫描上千个的文件

<h2 id="research">方案调研</h2>

Gulp 使用虚拟文件（Vinyl Objects）结合 Stream 来减少磁盘的 IO，这在一定程度上可以提升构建的速度，但并没有带来太大的收益，因此使用 Gulp 替代 Grunt 并没有真正的解决问题。

使用 Webpack 的 Dev Server 来做 Proxy，通过 Middlewares 处理各个阶段特定的任务是一个更好的方案。但迁移到 Angular2 后将使用 Webpack 来做构建，迁移到过程可能会持续一段时间，在这段时间内，原先的部署方式会保留使用，这也就意味着可能需要两个 Webpack Dev Server。另一方面，基于 Grunt 的使用经验来看，过度依赖一个工具将致使迁移成本很高。比如说，若现有的 Grunt 任务中文件的处理采用 NodeJS 来处理而非依赖于 Grunt 提供的 API 去处理，那么迁移到 Gulp 的过程将会顺利很多。

综合上述调研结果排除掉了 Gulp 和 Webpack，那么新的开发工具需要具备以下特性：

- 工具无关性。将所有文件处理交有 NodeJS 处理，工具将仅根据需要调用这些处理过程
- 去除复制到 Stage 的步骤
- 去除所有的 Watcher
- 易于扩展。例如支持 Wepack

<h2 id="servus">Servus</h2>

Servus 是一个独立的 Application Server，提供静态文件服务和反向代理后端请求，类似于 Nginx 静态文件服务器。她由一个基于 [Hapi](http://hapijs.com/) 框架编写的 Server 和 若干预处理器 组成。Server 通过路由配置，指定请求如何被处理。举个例子，当请求静态脚本文件 `asserts/js/login.js` 时，匹配的路由 `assets/js/{name*}` 所对应的处理器会在项目下查找此文件。这种映射请求到磁盘文件的方式，就无需复制文件到 Stage 目录；同时每一次请求都是直接读取磁盘文件，因此Watcher 也不再需要。

查找匹配文件的过程速度非常之快（通常在 20ms 以下），因此相对于之前的开发方式， Servus 在速度上有着质的提升。之前的开发方式需要几分钟的启动过程，Servus 仅需五秒以内（Sass 的预处理花费了接近两秒）即可完成；同时在开发过程了，因请求是直接映射磁盘文件也就避免了 Wacher 的诸多问题（例如修改没有被 Watch 到）。

Proxy 部分（主要是 `/api/*`）使用了穿透模式，也就是客户端的请求和服务器的响应都原封不动直接传递。

<h2 id="usage">如何使用</h2>

<h3 id="setup">安装</h3>

Servus 目前放置在一个独立的 Git 仓库中，因此首先第一步通过 `git clone` 下载代码，下载完成后使用 `npm install` 来安装依赖。命令如下：

```
cd c:\hgdins
git clone ${repostiry-url}
cd servus
npm install
```

<h3 id="configurations">配置</h3>

使用 Servus 之前，需要做少量的配置。Servus 的默认配置放置在 `config` 目录下，文件为 `servus.config.json`，其内容如下：

```json
{
  "portal_path": "c:/path/to/portal-web",
  "sass_mode": "watch",
  "connections": [
    {
      "active": true,
      "host": "0.0.0.0",
      "port": 9000,
      "site": "developer",
      "backend": {
        "protocol": "http",
        "host": "127.0.0.1",
        "port": 8080
      }
    },
    {
      "active": true,
      "host": "0.0.0.0",
      "port": 9009,
      "site": "admin",
      "backend": {
        "protocol": "http",
        "host": "127.0.0.1",
        "port": 8088
      }
    }
  ],
  "backend": {
    "passThrough": true,
    "xforward": true,
    "redirects": false
  }
}
```

由于个人的 Portal Web 的项目放置位置不同，因此自定义些许配置。自定义配置需要在 Servus 项目根目录下新建一个 `servus.config.json` 文件（此文件为 Git 所忽略），根据需要更改默认的配置即可。其中大部分的配置不需要做修改，这些选项的说明如下：

|option     |description                                           |
|-----------|------------------------------------------------------|
|portal_path| The path to DPW project                              |
|sass_mode  | Compass command, available values: `watch`, `compile`|
|connections| Connection to listen on             |
|connections.active| Active this connection or not |
|connections.host| connection address|
|connections.port| connection port to listen on|
|connections.site| To detemine what site the connection belong to|
|connections.backend| Backend information|
|backend.protocol| Backend server protocol    |
|backend.host    | Backend server address     |
|backend.port    | Backend server port. It will automatically switch to 8088 for admin site |
|backend.passThrough| If headers from client and backend will exchange directly|
|backend.xforward| If send 'X-Forwarded-*' to backend from servus|

<h3 id="running">运行</h3>

当配置完成后，使用 `npm start` 或者  `node .` 命令来启动 Servus 即可。
