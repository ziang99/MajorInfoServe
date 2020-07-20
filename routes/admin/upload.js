const express = require('express')
const router = express.Router()
const multer = require('multer')
// 引入操作数据库通用api
const db = require('../../module/db.js')
const fs = require('fs')

let storage = multer.diskStorage({
  // 将上传过来的图片保存在哪里
  destination: (req, file, cb) => {
    cb(null, './public/images') //如果没有此路径需要手动创建
  },
  // 设置上传过来的图片在本地的图片名
  filename: (req, file, cb) => {
    // 获取图片后缀名
    let suffixName = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
    // 设置图片新名称
    let newName = new Date().getTime() + parseInt(Math.random()*99999)
    cb(null, `${newName}.${suffixName}`)
  }
})

let upload = multer({ storage })

router
  .post('/', upload.single('file'), async (req, res) => {
    // file 是要上传图片的key值
    // console.log(req.file)
    let {size, originalname} = req.file
    // 允许上传的图片格式
    let types = ['jpg', 'png', 'jpeg']   
    // 获取图片后缀名
    let suffixName = originalname.substring(originalname.lastIndexOf('.') + 1);
    // 判断图片大小和类型
    if(size > 1048576){
      res.json({ code: 401, msg: '图片太大' })
      fs.unlink(`public/images/${req.file.filename}`, (err) => {
        if(err){
          console.log(err);
          return;
        }
        // console.log('图片太大删除成功');
      })
    }else if(types.indexOf(suffixName) === -1){
      res.json({ code: 402, msg: '格式有误' })
      fs.unlink(`public/images/${req.file.filename}`, (err) => {
        if(err){
          console.log(err);
          return;
        }
        // console.log('格式有误删除成功');
      })
    }else{
      let url = `/public/images/${req.file.filename}`
      // console.log(url)
      if(url){
        res.json({ img: url,  msg: '图片上传成功', status: 200 })
      }else{
        res.json({ msg: '图片上传失败', status: 400  })
      }
    }
  
  })

// 导出模块（在 index.js 中引入）
module.exports = router
