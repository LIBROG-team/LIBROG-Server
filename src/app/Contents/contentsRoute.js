module.exports = function(app){
    const contents = require('./contentsController');
    const multer = require("multer");

    // 확장자 알아내는 함수
    function getExt(fileName) {
        if (fileName.indexOf(".") == -1) {
          let fileExt = "Directory";
          return fileExt;
        }
    
        let fileLength = fileName.length;
        let lastDot = fileName.lastIndexOf(".");
        let fileExt = fileName.substring(lastDot, fileLength).toLowerCase().replace(".", "");
    
        return fileExt;
      }

    // 4.1 공지사항 배너 조회 API
    app.get('/contents/notice/', contents.getNotice);

    // 4.2 추천 책 조회 API
    app.get('/contents/recommendBooks/', contents.getRecommendBooks);

    // 4.3 프로필 이미지 업로드 API
    const storage = multer.diskStorage({
        destination: '/home/ubuntu/source/profileImg',
        filename: (req, file, cb) => {
            return cb (null, `${file.fieldname}_${Date.now()}.${getExt(file.originalname)}`);
        }
    })

    const upload = multer({
        storage: storage,
    });

    app.post('/contents/uploadProfileImg/', upload.single('profile'), contents.uploadProfileImg);
}