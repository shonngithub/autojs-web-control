## AutoJs Web Control


nodejs typescript vuejs  [SoulJs](https://github.com/zrk1993/souljs) [AutoJs](https://github.com/hyb1996/Auto.js)

### 说明
这是一个客户端使用autojs的web群控系统,集成了前后端服务;
前端和后端项目分别来自另外的两个github仓库,比较零散,只找到一篇比较老的博客记录了一些部署过程,上手使用很不方便,故整合了两个项目,制作了docker镜像和docker-compose文件;
如果只是使用不关注项目本身,下载复制deploy文件夹下docker-compose.yml和init.sql到同一文件夹,执行 docker-compose up -d 即可;

### 特性(character)

1. 支持群控
2. 脚本开发
3. 定时任务
4. 实时日志

## 部署(deploy)
1.复制deploy文件夹内容到服务器需要部署的目录下;
2.cd到该目录; 
```
    cd %your_file_path%
```
3.使用docker-compose部署镜像;
```
    docker-compose up -d
```
4.启动后访问80端口即可访问控制端页面,9317端口用于autojs远程连接;

5.修改docker-compose文件可重新映射上面的端口;

## 使用(USE)
1. 下载Autojs 4.x版本
2. 连接服务端，地址 <ip>:9317


## image

![screen-develop](https://raw.githubusercontent.com/zrk1993/autojs-web-control/master/image/develop.png)
![screen-device](https://raw.githubusercontent.com/zrk1993/autojs-web-control/master/image/device.png)
![screen-scheduler](https://raw.githubusercontent.com/zrk1993/autojs-web-control/master/image/scheduler.png)
![screen-workspaces](https://raw.githubusercontent.com/zrk1993/autojs-web-control/master/image/workspaces.png)

## License

application is [MIT licensed](LICENSE).
