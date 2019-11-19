export default class ResourceUtil {

    //todo 符合rule
    static loadSpriteRes (url, completion) {
        var res = cc.loader.getRes(url);
        if (!res) {
            cc.loader.loadRes(url, cc.SpriteFrame, completion);
        } else {
            var spriteFrame = new cc.SpriteFrame();
            spriteFrame.setTexture(res);
            completion(null, spriteFrame);
        }
    };

    /// 载入路径指定的Texture并生成对应的SpriteFrame
    /// - Parameter path: 图片文件相对路径，需存在于cocos的search path中，需带有扩展名。
    static loadSpriteFrameWithTexturePath(path, completion) {
        ResourceUtil.loadTextureWithPath(path, (err, tex) => {
            if (tex) {
                const size = tex.getContentSize()
                completion(null, new cc.SpriteFrame(tex, cc.rect(0, 0, size.width, size.height)))
            } else {
                completion(err, tex)
            }
        })
    }

    static resourcesFilePathForName (name) {
        return "res/raw-assets/resources/" + name
    }

    static loadTextureWithPath(path, completion, target = null) {
        path = this.getAbsolutePath(path);
        if (path instanceof Error) {
            completion(path, null)
            return
        }
        cc.textureCache.addImage(path, (tex) => {
            if (tex instanceof cc.Texture2D) {
                completion(null, tex)
            } else {
                completion(tex, null)
            }
        }, target)
    }

    static getAbsolutePath(path){
        let value = path;
        if (path.indexOf("/") != 0) {
            if (cc.sys.isNative) {
                path = jsb.fileUtils.fullPathForFilename(path) ||
                    jsb.fileUtils.fullPathForFilename(ResourceUtil.resourcesFilePathForName(path))
                if (!path) {
                    cc.log("get Absolute Path : File Not Found " + value);
                    path = new Error();
                }
            } else {
                path = ResourceUtil.resourcesFilePathForName(path);
            }
        }
        return path;
    }

    static loadTexture2DRes(url, completion) {
        var res = cc.loader.getRes(url);
        if (!res) {
            // @ts-ignore
            cc.loader.loadRes(url, cc.Texture2D, completion);
        } else {
            completion(null, res);
        }
    };

    static loadAudioClip(path, completion) {
        const res = cc.loader.getRes(path)
        if (res) {
            completion(null, res)
        } else {
            //@ts-ignore
            cc.loader.loadRes(path, cc.AudioClip, completion)
        }
    }
}