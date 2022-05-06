export var Wps = {
  createNew: (parentNode) => {
    if (!parentNode) {
      throw Error('缺少parentNode参数, 必须提供该参数作为WPS插件的父节点');
    }

    var _wps = document.createElement('embed');
    _wps.setAttribute('type', 'application/x-wps-np-plugin');
    _wps.setAttribute('height', '100%');
    _wps.setAttribute('width', '100%');
    _wps.setAttribute('id', 'embedID');

    parentNode.appendChild(_wps);

    _wps.WpsApplication = function () {
      return _wps.Application;
    };

    Wps.innerWps = _wps;

    var wpsExt = {};

    wpsExt.apis = {};
    wpsExt.enums = {};

    /**
     * 无参数
     */
    wpsExt.apis.getWPSVersion = function getWPSVersion() {
      return _wps.Application.Version;
    };

    wpsExt.getApplication = function () {
      return _wps.Application;
    };

    // ========== 书签相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     bookmarkName, // 书签名
     *     bookmarkValue, // 书签上显示的文本
     * }
     *
     * 无返回值
     *
     * 如果要添加的bookmarkName已存在, 则抛出异常
     */
    wpsExt.apis.setBookmarkValue = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarkName = params.bookmarkName;
      var bookmarkValue = params.bookmarkValue;
      var bookmarks = doc.Bookmarks;

      if (bookmarks.Exists(bookmarkName)) {
        var bookmark = bookmarks.Item(bookmarkName);
        var range = bookmark.Range;

        bookmark.Delete();
        range.Select();
        range.Text = bookmarkValue;

        bookmarks.Add(bookmarkName, range);
      } else {
        throw Error(`书签[${bookmarkName}]已存在`);
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     bookmarkIndex, // 根据下标删除书签, 下标从1开始, 优先级高于bookmarkName
     *     bookmarkName // 根据书签名删除书签
     * }
     *
     * 无返回值
     *
     * 如果书签不存在，则抛出异常
     */
    wpsExt.apis.deleteBookmark = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarks = doc.Bookmarks;
      var bookmarkIndex = params.bookmarkIndex;
      var bookmarkName = params.bookmarkName;

      let item = null;
      if (bookmarkIndex) {
        if (bookmarkIndex > bookmarks.Count) {
          throw Error(
            `书签索引溢出, 书签数量: ${bookmarks.Count}, 下标参数: ${bookmarkIndex}`,
          );
        }

        item = bookmarks.Item(bookmarkIndex);
      } else if (bookmarkName) {
        item = bookmarks.Item(bookmarkName);
      }

      if (item) {
        item.Range.Select();
        item.Range.Text = '';
        item.Delete();
      } else {
        throw Error('书签不存在');
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     bookmarkIndex, // 根据下标定位书签, 下标从1开始, 优先级高于bookmarkName
     *     bookmarkName // 根据书签名定位
     * }
     *
     * 无返回值
     *
     * 如果书签不存在，则抛出异常
     */
    wpsExt.apis.goToBookmark = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarks = doc.Bookmarks;
      var bookmarkIndex = params.bookmarkIndex;
      var bookmarkName = params.bookmarkName;

      let item = null;
      if (bookmarkIndex) {
        if (bookmarkIndex > bookmarks.Count) {
          throw Error(
            `书签索引溢出, 书签数量: ${bookmarks.Count}, 下标参数: ${bookmarkIndex}`,
          );
        }

        item = bookmarks.Item(bookmarkIndex);
      } else if (bookmarkName) {
        item = bookmarks.Item(bookmarkName);
      }

      if (item) {
        item.Select();
      } else {
        throw Error('书签不存在');
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     show, // true表示显示, false表示隐藏
     * }
     *
     * 无返回值
     */
    wpsExt.apis.showBookmarks = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      doc.ActiveWindow.View.ShowBookmarks = params.show;
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     bookmarkName, // 要设置的书签名
     * }
     *
     * 无返回值
     *
     * 如果要设置的bookmarkName已存在则抛出异常
     */
    wpsExt.apis.setSelectedTextAsBookmark = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarkName = params.bookmarkName;
      var bookmarks = doc.Bookmarks;

      if (bookmarks.Exists(bookmarkName)) {
        throw Error(`书签 ${bookmarkName} 已存在`);
      } else {
        var range = doc.ActiveWindow.Selection.Range;

        range.Select();
        bookmarks.Add(bookmarkName, range);
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     bookmarkName, // 书签名, 根据该书签名获取其在文档上显示的文本
     * }
     *
     * 返回值 = {
     *     text, // 书签的文本值
     * }
     *
     * 如果书签不存在则抛出异常
     */
    wpsExt.apis.getBookmarkText = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarkName = params.bookmarkName;
      var bookmarks = doc.Bookmarks;

      if (bookmarks.Exists(bookmarkName)) {
        return { text: bookmarks.Item(bookmarkName).Range.Text };
      } else {
        throw Error(`书签[${bookmarkName}]不存在`);
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     * }
     *
     * 返回值 = {
     *     count, // 书签数量
     * }
     */
    wpsExt.apis.getBookmarkCount = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarks = doc.Bookmarks;

      return { count: bookmarks.Count };
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     bookmarkName, // 要判断存在与否的书签名
     * }
     *
     * 返回值 = {
     *     exists, // true代表存在, false代表不存在
     * }
     */
    wpsExt.apis.bookmarkExists = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var bookmarkName = params.bookmarkName;
      var bookmarks = doc.Bookmarks;

      return { exists: bookmarks.Exists(bookmarkName) };
    };

    // ========== 书签相关函数

    // ==========对话框相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     * }
     *
     * 无返回值
     */
    wpsExt.apis.printDoc = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      doc.Activate();

      var wpsApp = _wps.WpsApplication();
      wpsApp.Dialogs.Item(wpsExt.enums.WdWordDialog.wdDialogFilePrint).Show();
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     wdWordDialog, // 窗口代表值，详见word二次开发文档WdWordDialog对象
     * }
     *
     * 无返回值
     */
    wpsExt.apis.showDialog = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var wdWordDialog = params.wdWordDialog;
      var dialogs = doc.Application.Dialogs;

      dialogs.Item(wdWordDialog).Show();
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     * }
     *
     * 无返回值
     */
    wpsExt.apis.printPreview = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      doc.PrintPreview();
    };

    // ==========对话框相关函数

    // ==========文档相关函数

    /**
     * 注意：该方法不返回Promise
     */
    wpsExt.apis.getDoc = function (params) {
      var wpsApp = _wps.WpsApplication();

      if (params && params.docName) {
        var docs = wpsApp.Documents;
        var count = docs.Count;

        for (let i = 0; i < count; i++) {
          var doc = docs.Item(i);
          if (params.docName === doc.Name) {
            doc.Activate();
            return doc;
          }
        }

        throw Error('未找到指定文档');
      } else {
        return wpsApp.ActiveDocument;
      }
    };

    /**
     * params = {
     * }
     *
     * 无返回值
     */
    wpsExt.apis.newDoc = function () {
      _wps.createDocument('wps');
    };

    /**
     * params = {
     *     filePath, // 文件路径，如果不传递该参数则打开一个选择框
     *     readOnly, // true或false，是否以只读模式打开
     * }
     *
     * 返回值 = {
     *     filePath: 打开的文件路径, 如果用户取消打开则该值为undefined,
     * }
     *
     */
    wpsExt.apis.openLocalDoc = function (params = { readOnly: false }) {
      var app = _wps.WpsApplication();
      var readOnly = params.readOnly ? true : false;
      let filePath = params.filePath;

      if (!filePath && app.FileDialog(1).Show() === -1) {
        filePath = app.FileDialog(1).SelectedItems.Item(1);
      }

      if (filePath) {
        console.log(`是否只读模式打开: ${readOnly}`);
        _wps.loadDocument(filePath, readOnly);
      }

      return { filePath: filePath };
    };

    /**
     * params = {
     *     url, // 远程文档的URL，必须是http://......这一类的地址
     * }
     *
     * 无返回值
     */
    wpsExt.apis.openRemoteDoc = function (params = { readOnly: false }) {
      if (!params || !params.url) {
        throw Error('openRemoteDoc必须传入param.url参数');
      }
      if (params.url.indexOf('http') !== 0) {
        throw Error('param.url参数必须是http开头');
      }

      var readOnly = params.readOnly ? true : false;

      console.log(`是否只读模式打开: ${readOnly}`);
      var app = _wps.WpsApplication();
      app.openDocumentRemote(params.url, readOnly);
    };

    /**
     * ，会调用Promise.reject('用户已取消保存')
     *
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     format, // 保存的格式, 详见Wps.enums.WdSaveFormat
     *     savePath, //保存的路径, 如果不提供的话，则弹出对话框选择保存路径
     * }
     *
     * 返回值 = {
     *     savePath, // 保存路径, 如果用户取消保存则该值为undefined
     * }
     */
    wpsExt.apis.saveToLocal = function (params = {}) {
      var app = _wps.WpsApplication();
      var doc = wpsExt.apis.getDoc(params);
      let savePath = params.savePath;

      if (!savePath) {
        if (app.FileDialog(2).Show() === -1) {
          savePath = app.FileDialog(2).SelectedItems.Item(1);
          doc.SaveAs2(savePath);
        }
      } else {
        doc.SaveAs2(savePath);
      }

      return { savePath: savePath };
    };

    // 注意：该方法不返回Promise
    function _getFormat() {
      var doc = wpsExt.apis.getDoc({});

      return doc.Type;
    }

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     url, // 文件上传的URL
     * }
     *
     * 无返回值
     */
    wpsExt.apis.saveToRemote = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      doc.Activate();

      if (!params.url || params.url.trim() === '') {
        throw Error('saveToRemote必须传入param.url参数');
      }
      if (params.url.indexOf('http') !== 0) {
        throw Error('param.url参数必须是http开头');
      }
      console.log('uploadfilename', `${doc.Path}/${doc.Name}`);
      var tmpSavePath =
        `${_wps.GetTempPath()}` + new Date().getUTCMilliseconds();
      var v = wpsExt.apis.saveToLocal({ savePath: tmpSavePath });
      return _wps.UploadFile(params.url, `${doc.Path}/${doc.Name}`);
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     userName, // 作者名称
     * }
     *
     * 无返回值
     */
    wpsExt.apis.setUserName = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var userName = params.userName;

      if (!userName) {
        throw Error(`setUserName必须传入正确的参数, userName: ${userName}`);
      }

      doc.Application.UserName = userName;
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     from, // 要查找(被替换)的文本
     *     to, // 要替换成的文本
     * }
     *
     * 无返回值
     */
    wpsExt.apis.findAndReplace = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var from = params.from;
      var to = params.to;
      var continueFind = 1; // 到达搜索范围的开始或结尾时，继续执行查找操作
      var replaceType = 1; // 只替换第一个

      // 详见word开发文档, Find.Execute
      doc.Application.Selection.Find.Execute(
        from,
        false,
        false,
        false,
        false,
        false,
        true,
        continueFind,
        false,
        to,
        replaceType,
      );
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     * }
     *
     * 无返回值
     */
    wpsExt.apis.acceptAllRevisions = function (params) {
      var doc = wpsExt.apis.getDoc(params);
      doc.AcceptAllRevisions();
    };

    // ==========文档相关函数

    // ==========文档属性相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     name, // 属性名
     *     value, // 属性值
     * }
     *
     * 无返回值
     */
    wpsExt.apis.setDocProperty = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      let item = doc.BuiltInDocumentProperties.Item(params.name);

      item.Value = params.value;
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     name, // 属性名
     * }
     *
     * 返回值 = {
     *     value, // 文档属性值
     * }
     *
     * 如果指定的文档属性不存在则抛出异常
     */
    wpsExt.apis.getDocProperty = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      let item = doc.BuiltInDocumentProperties.Item(params.name);
      if (item) {
        return { value: item.Value };
      } else {
        throw Error(`文档属性[${params.name}]不存在`);
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     name, // 属性名
     * }
     *
     * 无返回值
     *
     * 如果指定的文档属性不存在则抛出异常
     */
    wpsExt.apis.deleteDocProperty = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      var item = doc.BuiltInDocumentProperties.Item(params.name);
      if (item) {
        item.Delete();
      } else {
        throw Error(`文档属性[${params.name}]不存在`);
      }
    };

    // ==========文档属性相关函数

    // ==========超链接相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     text, // 如果text值不为空, 则在当前光标位置插入text(若当前选中文本则是替换), 并选中text, 设置选中的文本的超链接
     *     address, // 超链接地址
     * }
     *
     * 无返回值
     */
    wpsExt.apis.insertHyperlink = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var selection = doc.Application.Selection;

      var text = params.text;
      if (text) {
        selection.InsertAfter(text);
      }

      var range = selection.Range;
      var address = params.address;

      doc.Hyperlinks.Add(range, address);
    };

    // ==========超链接相关函数

    // ==========图片相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     picPath, // 图片的本地路径
     *     height, // 图片的高度
     *     width, // 图片的宽度
     *     shapeType, // 是否转换为粘贴型图片
     *     horizontalPos, // 图片的相对水平位置, 可设置的值详见Wps.enums.WdRelativeHorizontalPosition
     *     verticalPos, // 图片的相对垂直位置, 可设置的值详见Wps.enums.WdRelativeHorizontalPosition
     *     left, // 设置指定形状或形状范围的水平位置（以磅为单位）
     *     top, // 设置指定形状或形状范围的垂直位置（以磅为单位）。
     * }
     *
     * 无返回值
     */
    wpsExt.apis.insertImage = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      doc.Activate();

      let picPath = params.picPath;
      if (!picPath) {
        throw Error('insertImage必须提供params.picPath参数');
      }

      var selection = _wps.WpsApplication().ActiveWindow.Selection;
      var pic = selection.InlineShapes.AddPicture(picPath, false, true);

      var height = params.height;
      var width = params.width;

      pic.LockAspectRatio = 0;

      if (height) {
        pic.Height = height;
      }
      if (width) {
        pic.Width = width;
      }

      pic.Select();

      if (
        params.shapeType &&
        params.horizontalPos !== undefined &&
        params.verticalPos !== undefined &&
        params.left !== undefined &&
        params.top !== undefined
      ) {
        var sealShape = pic.ConvertToShape();

        sealShape.RelativeHorizontalPosition = params.horizontalPos;
        sealShape.RelativeVerticalPosition = params.verticalPos;
        sealShape.Left = params.left;
        sealShape.Top = params.top;
      }
    };

    // ==========图片相关函数

    // ==========文档保护相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     protectionType, // 保护类型，Wps.enums.WdProtectionType
     *     password, // 密码
     * }
     *
     * 无返回值
     */
    wpsExt.apis.protect = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var protectionType = params.protectionType;
      var password = params.password;

      if (protectionType !== doc.ProtectionType) {
        doc.Protect(protectionType, null, password);
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     password, // 密码
     * }
     *
     * 无返回值
     */
    wpsExt.apis.unprotect = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var password = params.password;

      if (doc.ProtectionType !== -1) {
        doc.Unprotect(password);
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     * }
     *
     * 返回值 = {
     *     protectionType, // 保护类型枚举值
     * }
     */
    wpsExt.apis.getProtectionType = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var protectionType = doc.ProtectionType;

      return { protectionType: protectionType };
    };

    // ==========文档保护相关函数

    // ==========表格相关函数

    function __ensureIndex(
      params,
      tables,
      requireColIndex = false,
      requireRowIndex = false,
    ) {
      if (!params || !tables) {
        return;
      }

      var tableIndex = params.tableIndex;
      var rowIndex = params.rowIndex;
      var colIndex = params.colIndex;

      if (tableIndex === 0) throw Error(`表的下标不允许为0, 从1开始计数`);
      if (rowIndex === 0) throw Error(`表的行下标不允许为0, 从1开始计数`);
      if (colIndex === 0) throw Error(`表的列下标不允许为0, 从1开始计数`);

      if (!tableIndex) throw Error(`参数不合法, 未提供params.tableIndex`);
      if (tableIndex > tables.Count)
        throw Error(
          `表索引溢出, 表数量: ${tables.Count || 0}, 下标参数: ${tableIndex}`,
        );

      if (requireRowIndex && !rowIndex)
        throw Error(`参数不合法, 未提供params.rowIndex`);
      if (requireColIndex && !colIndex)
        throw Error(`参数不合法, 未提供params.colIndex`);

      if (!colIndex && !rowIndex) {
        return;
      }

      var table = tables.Item(tableIndex);

      if (colIndex && colIndex > table.Columns.Count) {
        throw Error(
          `列索引溢出, 列数量: ${table.Columns.Count}, 下标参数: ${colIndex}`,
        );
      }
      if (rowIndex > table.Rows.Count) {
        throw Error(
          `行索引溢出, 行数量: ${table.Rows.Count}, 下标参数: ${rowIndex}`,
        );
      }
    }

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     colIndex, // 要删除的列索引, 从1开始
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.deleteTableColumn = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;

      __ensureIndex(params, tables, true);

      var table = tables.Item(tableIndex);

      table.Columns.Item(params.colIndex).Delete();
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     rowIndex, // 要删除的行索引,  从1开始
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.deleteTableRow = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;

      __ensureIndex(params, tables, false, true);

      var table = tables.Item(tableIndex);

      table.Rows.Item(params.rowIndex).Delete();
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     colIndex, // 列下表, 从1开始
     *     rowIndex, // 行下标, 从1开始
     *     text,  // 单元格值
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.setTableCellValue = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;
      var colIndex = params.colIndex;
      var rowIndex = params.rowIndex;
      var text = params.text;

      __ensureIndex(params, tables, true, true);

      var table = tables.Item(tableIndex);
      var range = table.Cell(rowIndex, colIndex).Range;
      range.Select();
      range.Text = text;
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     cellList: [{
     *         colIndex, // 列下表, 从1开始
     *         rowIndex // 行下标, 从1开始
     *     }, {
     *         colIndex,
     *         rowIndex
     *     },
     *     ...
     *     ]
     *     password, // 密码
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.docProtectExceptCell = function (params = {}) {
      if (!params.cellList || params.cellList < 1)
        throw Error(`至少需要指定一个要保护的单元格`);

      var doc = wpsExt.apis.getDoc(params);
      var password = params.password;

      // 先解锁文档
      var unprotectParams = {
        doc: doc,
        password: password,
      };

      wpsExt.apis.unprotect(unprotectParams);

      // 重新以只读的方式加锁
      var protectParams = {
        doc: doc,
        password: password,
        protectionType: 3, // 只读
      };

      wpsExt.apis.protect(protectParams);

      // 此时整个文档都是只读的, 然后再设置允许编辑的表格部分
      var tables = doc.Tables;

      __ensureIndex(params, tables);

      var tableIndex = params.tableIndex;
      var table = tables.Item(tableIndex);

      var cellCount = params.cellList.length;
      for (let i = 0; i < cellCount; i++) {
        var rowIndex = params.cellList[i].rowIndex;
        var colIndex = params.cellList[i].colIndex;

        try {
          __ensureIndex(
            {
              tableIndex: tableIndex,
              rowIndex: rowIndex,
              colIndex: colIndex,
            },
            tables,
            true,
            true,
          );
        } catch (e) {
          console.warn(e);
          continue;
        }

        var cell = table.Cell(rowIndex, colIndex);
        cell.Range.Editors.Add(-1); //允许所有打开文档的用户编辑
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     colIndex, // 插入到colIndex之前, 不设置该字段则插入到最后一列之后
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.addTableColumn = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;

      __ensureIndex(params, tables);

      var table = tables.Item(tableIndex);

      if (params.colIndex) {
        var beforeColumn = table.Columns.Item(params.colIndex);
        table.Columns.Add(beforeColumn);
      } else {
        table.Columns.Add();
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     rowIndex, // 插入到rowIndex之前, 不设置该字段则插入到最后一行之后
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.addTableRow = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;

      __ensureIndex(params, tables);

      var table = tables.Item(tableIndex);

      if (params.rowIndex) {
        var beforeRow = table.Rows.Item(params.rowIndex);
        table.Rows.Add(beforeRow);
      } else {
        table.Rows.Add();
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     colIndex, // 列下表, 从1开始
     *     rowIndex, // 行下标, 从1开始
     * }
     *
     * 无返回值
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.goToTable = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;

      __ensureIndex(params, tables);

      var table = tables.Item(tableIndex);

      var colIndex = params.colIndex;
      var rowIndex = params.rowIndex;

      if (colIndex && rowIndex) {
        __ensureIndex(params, tables, true, true);

        table.Cell(rowIndex, colIndex).Select();
      } else {
        table.Select();
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     colIndex, // 列下表, 从1开始
     *     rowIndex, // 行下标, 从1开始
     *     cb, // 回调函数, 接收一个参数: text, 指定单元格的内容
     * }
     *
     * 返回值 = {
     *     text, //指定单元格的值
     * }
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.getTableCellValue = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;
      var colIndex = params.colIndex;
      var rowIndex = params.rowIndex;

      __ensureIndex(params, tables, true, true);

      var table = tables.Item(tableIndex);
      var range = table.Cell(rowIndex, colIndex).Range;

      // FIXME 12.0版WPS总最后总会多出一个ascii码为7的字符
      if (range.Text.endsWith('\ra')) {
        return range.Text.substring(0, range.Text.length - 2);
      }

      return { text: range.Text.replace('\ra', '') };
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     // colIndex, // 可选, 列下表, 从1开始
     *     cb, // 回调函数, 接收一个参数: count, 指定表(的指定列)的行数
     * }
     *
     * 返回值 = {
     *     count, // 行数
     * }
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.getTableRowCount = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;
      var colIndex = params.colIndex;

      if (colIndex) {
        __ensureIndex(params, tables, true);

        var table = tables.Item(tableIndex);
        var rowCount = table.Rows.Count;

        let count = 0;
        for (let i = 1; i <= rowCount; i++) {
          var cell = table.Cell(i, colIndex);

          if (cell === null || cell === undefined) {
            continue;
          }
          if (cell.RowIndex !== i || cell.ColumnIndex !== colIndex) {
            continue;
          }

          count++;
        }

        return { count: count };
      } else {
        __ensureIndex(params, tables);

        var table = tables.Item(tableIndex);

        return { count: table.Rows.Count };
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     // rowIndex, // 可选，列下表, 从1开始
     *     cb, // 回调函数, 接收一个参数: count, 指定表(的指定行)的列数
     * }
     *
     * 返回值 = {
     *     count, // 列数
     * }
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.getTableColCount = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;
      var rowIndex = params.rowIndex;

      if (rowIndex) {
        __ensureIndex(params, tables, false, true);

        var table = tables.Item(tableIndex);
        var colCount = table.Columns.Count;

        let count = 0;
        for (let i = 1; i <= colCount; i++) {
          var cell = table.Cell(rowIndex, i);

          if (cell === null || cell === undefined) {
            continue;
          }
          if (cell.RowIndex !== rowIndex || cell.ColumnIndex !== i) {
            continue;
          }

          count++;
        }

        return { count: count };
      } else {
        __ensureIndex(params, tables);

        var table = tables.Item(tableIndex);

        return { count: table.Columns.Count };
      }
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     cb, // 回调函数, 接收一个参数: count, 表示文档表格数量
     * }
     *
     * 返回值 = {
     *     count, // 表数量
     * }
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.getTableCount = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;

      return { count: tables.Count || 0 };
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     text, // 要定位的文本
     *     cb, // 回调函数, 接收两个参数: rowIndex和colIndex, 表示指定内容所在行索引和列索引, 不存在时两个参数的值都为-1
     * }
     *
     * 返回值 {
     *     rowIndex, // 文本在表中的行下标, 不存在时该字段值为-1
     *     colIndex, //  文本在表中的列下标, 不存在时该字段值为-1
     * }
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.getTableTextIndex = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;
      var text = params.text;

      __ensureIndex(params, tables);

      var table = tables.Item(tableIndex);
      var rowCount = table.Rows.Count;
      var colCount = table.Columns.Count;

      for (let i = 1; i <= rowCount; i++) {
        for (let j = 1; j <= colCount; j++) {
          var cell = table.Cell(i, j);

          if (cell === null || cell === undefined) {
            continue;
          }
          if (cell.RowIndex !== i || cell.ColumnIndex !== j) {
            continue;
          }

          // WPS的单元格取值最后都会有\r\a
          let t = cell.Range.Text;
          if (t[t.length - 1].charCodeAt(0) === 7) {
            t = t.substring(0, t.length - 1);
          }
          if (t[t.length - 1].charCodeAt(0) === 13) {
            t = t.substring(0, t.length - 1);
          }

          if (t === text) {
            return {
              rowIndex: i,
              colIndex: j,
            };
          }
        }
      }

      return {
        rowIndex: -1,
        colIndex: -1,
      };
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     tableIndex, // 表下标, 从1开始
     *     text, // 要匹配的文本
     *     cb, // 回调函数, 接收一个参数: count, 表示包含指定文本的行数(同一行多次出现仅算一次)
     * }
     *
     * 返回值 = {
     *     count, // 包含指定文本的行的数量
     * }
     *
     * 索引若溢出则抛出异常
     */
    wpsExt.apis.getTableTextOccurRowCount = function (params = {}) {
      // FIXME 计算错误
      var doc = wpsExt.apis.getDoc(params);
      var tables = doc.Tables;
      var tableIndex = params.tableIndex;
      var text = params.text;

      __ensureIndex(params, tables);

      var table = tables.Item(tableIndex);

      var rowCount = table.Rows.Count;
      var colCount = table.Columns.Count;

      let count = 0;
      for (let i = 1; i <= rowCount; i++) {
        for (let j = 1; j <= colCount; j++) {
          var cell = table.Cell(i, j);

          if (cell === null || cell === undefined) {
            continue;
          }
          if (cell.RowIndex !== i || cell.ColumnIndex !== j) {
            continue;
          }

          // WPS的单元格取值最后都会有\r\a
          let t = cell.Range.Text;
          if (t[t.length - 1].charCodeAt(0) === 7) {
            t = t.substring(0, t.length - 1);
          }
          if (t[t.length - 1].charCodeAt(0) === 13) {
            t = t.substring(0, t.length - 1);
          }

          console.log(t);

          if (t === text) {
            count++;
            break;
          }
        }
      }

      return { count: count };
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     show, // true表示显示, false表示隐藏
     * }
     *
     * 无返回值
     */
    wpsExt.apis.shadeEditableRanges = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      doc.ActiveWindow.View.ShadeEditableRanges = params.show;
    };

    // ==========表格相关函数

    // ==========文本相关函数

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     *     text, // 要插入的文本
     * }
     *
     * 无返回值
     */
    wpsExt.apis.insertText = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);
      var text = params.text;
      var selection = doc.Application.Selection;

      selection.InsertAfter(text);
    };

    /**
     * params = {
     *     docName, // 指定要操作文档, 如果没设置该参数，则默认使用当前的活动文档
     * }
     *
     * 返回值 = {
     *     text, // 选中的文本
     * }
     */
    wpsExt.apis.getSelectedText = function (params = {}) {
      var doc = wpsExt.apis.getDoc(params);

      return { text: doc.ActiveWindow.Selection.Range.Text };
    };

    // ==========文本相关函数

    return wpsExt;
  },
  enums: {
    WdWordDialog: {
      wdDialogHelpAbout: 9,
      wdDialogHelpWordPerfectHelp: 10,
      wdDialogDocumentStatistics: 78,
      wdDialogFileNew: 79,
      wdDialogFileOpen: 80,
      wdDialogMailMergeOpenDataSource: 81,
      wdDialogMailMergeOpenHeaderSource: 82,
      wdDialogFileSaveAs: 84,
      wdDialogFileSummaryInfo: 86,
      wdDialogToolsTemplates: 87,
      wdDialogFilePrint: 88,
      wdDialogFilePrintSetup: 97,
      wdDialogFileFind: 99,
      wdDialogFormatAddrFonts: 103,
      wdDialogEditPasteSpecial: 111,
      wdDialogEditFind: 112,
      wdDialogEditReplace: 117,
      wdDialogEditStyle: 120,
      wdDialogEditLinks: 124,
      wdDialogEditObject: 125,
      wdDialogTableToText: 128,
      wdDialogTextToTable: 127,
      wdDialogTableInsertTable: 129,
      wdDialogTableInsertCells: 130,
      wdDialogTableInsertRow: 131,
      wdDialogTableDeleteCells: 133,
      wdDialogTableSplitCells: 137,
      wdDialogTableRowHeight: 142,
      wdDialogTableColumnWidth: 143,
      wdDialogToolsCustomize: 152,
      wdDialogInsertBreak: 159,
      wdDialogInsertSymbol: 162,
      wdDialogInsertPicture: 163,
      wdDialogInsertFile: 164,
      wdDialogInsertDateTime: 165,
      wdDialogInsertField: 166,
      wdDialogInsertMergeField: 167,
      wdDialogInsertBookmark: 168,
      wdDialogMarkIndexEntry: 169,
      wdDialogInsertIndex: 170,
      wdDialogInsertTableOfContents: 171,
      wdDialogInsertObject: 172,
      wdDialogToolsCreateEnvelope: 173,
      wdDialogFormatFont: 174,
      wdDialogFormatParagraph: 175,
      wdDialogFormatSectionLayout: 176,
      wdDialogFormatColumns: 177,
      wdDialogFileDocumentLayout: 178,
      wdDialogFilePageSetup: 178,
      wdDialogFormatTabs: 179,
      wdDialogFormatStyle: 180,
      wdDialogFormatDefineStyleFont: 181,
      wdDialogFormatDefineStylePara: 182,
      wdDialogFormatDefineStyleTabs: 183,
      wdDialogFormatDefineStyleFrame: 184,
      wdDialogFormatDefineStyleBorders: 185,
      wdDialogFormatDefineStyleLang: 186,
      wdDialogFormatPicture: 187,
      wdDialogToolsLanguage: 188,
      wdDialogFormatBordersAndShading: 189,
      wdDialogFormatFrame: 190,
      wdDialogToolsThesaurus: 194,
      wdDialogToolsHyphenation: 195,
      wdDialogToolsBulletsNumbers: 196,
      wdDialogToolsHighlightChanges: 197,
      wdDialogToolsRevisions: 197,
      wdDialogToolsCompareDocuments: 198,
      wdDialogTableSort: 199,
      wdDialogToolsOptionsGeneral: 203,
      wdDialogToolsOptionsView: 204,
      wdDialogToolsAdvancedSettings: 206,
      wdDialogToolsOptionsPrint: 208,
      wdDialogToolsOptionsSave: 209,
      wdDialogToolsOptionsSpellingAndGrammar: 211,
      wdDialogToolsOptionsUserInfo: 213,
      wdDialogToolsMacroRecord: 214,
      wdDialogToolsMacro: 215,
      wdDialogWindowActivate: 220,
      wdDialogFormatRetAddrFonts: 221,
      wdDialogOrganizer: 222,
      wdDialogToolsOptionsEdit: 224,
      wdDialogToolsOptionsFileLocations: 225,
      wdDialogToolsWordCount: 228,
      wdDialogControlRun: 235,
      wdDialogInsertPagvarbers: 294,
      wdDialogFormatPagvarber: 298,
      wdDialogCopyFile: 300,
      wdDialogFormatChangeCase: 322,
      wdDialogUpdateTOC: 331,
      wdDialogInsertDatabase: 341,
      wdDialogTableFormula: 348,
      wdDialogFormFieldOptions: 353,
      wdDialogInsertCaption: 357,
      wdDialogInsertCaptionNumbering: 358,
      wdDialogInsertAutoCaption: 359,
      wdDialogFormFieldHelp: 361,
      wdDialogInsertCrossReference: 367,
      wdDialogInsertFootnote: 370,
      wdDialogNoteOptions: 373,
      wdDialogToolsAutoCorrect: 378,
      wdDialogToolsOptionsTrackChanges: 386,
      wdDialogConvertObject: 392,
      wdDialogInsertAddCaption: 402,
      wdDialogConnect: 420,
      wdDialogToolsCustomizeKeyboard: 432,
      wdDialogToolsCustomizeMenus: 433,
      wdDialogToolsMergeDocuments: 435,
      wdDialogMarkTableOfContentsEntry: 442,
      wdDialogFileMacPageSetupGX: 444,
      wdDialogFilePrintOneCopy: 445,
      wdDialogEditFrame: 458,
      wdDialogMarkCitation: 463,
      wdDialogTableOfContentsOptions: 470,
      wdDialogInsertTableOfAuthorities: 471,
      wdDialogInsertTableOfFigures: 472,
      wdDialogInsertIndexAndTables: 473,
      wdDialogInsertFormField: 483,
      wdDialogFormatDropCap: 488,
      wdDialogToolsCreateLabels: 489,
      wdDialogToolsProtectDocument: 503,
      wdDialogFormatStyleGallery: 505,
      wdDialogToolsAcceptRejectChanges: 506,
      wdDialogHelpWordPerfectHelpOptions: 511,
      wdDialogToolsUnprotectDocument: 521,
      wdDialogToolsOptionsCompatibility: 525,
      wdDialogTableOfCaptionsOptions: 551,
      wdDialogTableAutoFormat: 563,
      wdDialogMailMergeFindRecord: 569,
      wdDialogReviewAfmtRevisions: 570,
      wdDialogViewZoom: 577,
      wdDialogToolsProtectSection: 578,
      wdDialogFontSubstitution: 581,
      wdDialogInsertSubdocument: 583,
      wdDialogNewToolbar: 586,
      wdDialogToolsEnvelopesAndLabels: 607,
      wdDialogFormatCallout: 610,
      wdDialogTableFormatCell: 612,
      wdDialogToolsCustomizeMenuBar: 615,
      wdDialogFileRoutingSlip: 624,
      wdDialogEditTOACategory: 625,
      wdDialogToolsManageFields: 631,
      wdDialogDrawSnapToGrid: 633,
      wdDialogDrawAlign: 634,
      wdDialogMailMergeCreateDataSource: 642,
      wdDialogMailMergeCreateHeaderSource: 643,
      wdDialogMailMerge: 676,
      wdDialogMailMergeCheck: 677,
      wdDialogMailMergeHelper: 680,
      wdDialogMailMergeQueryOptions: 681,
      wdDialogFileMacPageSetup: 685,
      wdDialogListCommands: 723,
      wdDialogEditCreatePublisher: 732,
      wdDialogEditSubscribeTo: 733,
      wdDialogEditPublishOptions: 735,
      wdDialogEditSubscribeOptions: 736,
      wdDialogFileMacCustomPageSetupGX: 737,
      wdDialogToolsOptionsTypography: 739,
      wdDialogToolsAutoCorrectExceptions: 762,
      wdDialogToolsOptionsAutoFormatAsYouType: 778,
      wdDialogMailMergeUseAddressBook: 779,
      wdDialogToolsHangulHanjaConversion: 784,
      wdDialogToolsOptionsFuzzy: 790,
      wdDialogEditGoToOld: 811,
      wdDialogInsertNumber: 812,
      wdDialogLetterWizard: 821,
      wdDialogFormatBulletsAndNumbering: 824,
      wdDialogToolsSpellingAndGrammar: 828,
      wdDialogToolsCreateDirectory: 833,
      wdDialogTableWrapping: 854,
      wdDialogFormatTheme: 855,
      wdDialogTableProperties: 861,
      wdDialogEmailOptions: 863,
      wdDialogCreateAutoText: 872,
      wdDialogToolsAutoSummarize: 874,
      wdDialogToolsGrammarSettings: 885,
      wdDialogEditGoTo: 896,
      wdDialogWebOptions: 898,
      wdDialogInsertHyperlink: 925,
      wdDialogToolsAutoManager: 915,
      wdDialogFileVersions: 945,
      wdDialogToolsOptionsAutoFormat: 959,
      wdDialogFormatDrawingObject: 960,
      wdDialogToolsOptions: 974,
      wdDialogFitText: 983,
      wdDialogEditAutoText: 985,
      wdDialogPhoneticGuide: 986,
      wdDialogToolsDictionary: 989,
      wdDialogFileSaveVersion: 1007,
      wdDialogToolsOptionsBidi: 1029,
      wdDialogFrameSetProperties: 1074,
      wdDialogTableTableOptions: 1080,
      wdDialogTableCellOptions: 1081,
      wdDialogIMESetDefault: 1094,
      wdDialogTCSCTranslator: 1156,
      wdDialogHorizontalInVertical: 1160,
      wdDialogTwoLinesInOne: 1161,
      wdDialogFormatEncloseCharacters: 1162,
      wdDialogConsistencyChecker: 1121,
      wdDialogToolsOptionsSmartTag: 1395,
      wdDialogFormatStylesCustom: 1248,
      wdDialogCSSLinks: 1261,
      wdDialogInsertWebComponent: 1324,
      wdDialogToolsOptionsEditCopyPaste: 1356,
      wdDialogToolsOptionsSecurity: 1361,
      wdDialogSearch: 1363,
      wdDialogShowRepairs: 1381,
      wdDialogMailMergeInsertAsk: 4047,
      wdDialogMailMergeInsertFillIn: 4048,
      wdDialogMailMergeInsertIf: 4049,
      wdDialogMailMergeInsertNextIf: 4053,
      wdDialogMailMergeInsertSet: 4054,
      wdDialogMailMergeInsertSkipIf: 4055,
      wdDialogMailMergeFieldMapping: 1304,
      wdDialogMailMergeInsertAddressBlock: 1305,
      wdDialogMailMergeInsertGreetingLine: 1306,
      wdDialogMailMergeInsertFields: 1307,
      wdDialogMailMergeRecipients: 1308,
      wdDialogMailMergeFindRecipient: 1326,
      wdDialogMailMergeSetDocumentType: 1339,
      wdDialogLabelOptions: 1367,
      wdDialogXMLElementAttributes: 1460,
      wdDialogSchemaLibrary: 1417,
      wdDialogPermission: 1469,
      wdDialogMyPermission: 1437,
      wdDialogXMLOptions: 1425,
      wdDialogFormattingRestrictions: 1427,
      wdDialogSourceManager: 1920,
      wdDialogCreateSource: 1922,
      wdDialogDocumentInspector: 1482,
      wdDialogStyleManagement: 1948,
      wdDialogInsertSource: 2120,
      wdDialogOMathRecognizedFunctions: 2165,
      wdDialogInsertPlaceholder: 2348,
      wdDialogBuildingBlockOrganizer: 2067,
      wdDialogContentControlProperties: 2394,
      wdDialogCompatibilityChecker: 2439,
      wdDialogExportAsFixedFormat: 2349,
      wdDialogFileNew2007: 1116,
    },
    docProperty: {
      msoPropertyNumber: 1,
      msoPropertyBoolean: 2,
      msoPropertyDate: 3,
      msoPropertyString: 4,
      msoPropertyFloat: 5,
    },
    WdSaveFormat: {
      wdFormatDocument: 0,
      wdFormatDocument97: 0,
      wdFormatTemplate: 1,
      wdFormatTemplate97: 1,
      wdFormatText: 2,
      wdFormatTextLineBreaks: 3,
      wdFormatDOSText: 4,
      wdFormatDOSTextLineBreaks: 5,
      wdFormatRTF: 6,
      wdFormatUnicodeText: 7,
      wdFormatEncodedText: 7,
      wdFormatHTML: 8,
      wdFormatWebArchive: 9,
      wdFormatFilteredHTML: 10,
      wdFormatXML: 11,
      wdFormatXMLDocument: 12,
      wdFormatXMLDocumentMacroEnabled: 13,
      wdFormatXMLTemplate: 14,
      wdFormatXMLTemplateMacroEnabled: 15,
      wdFormatDocumentDefault: 16,
      wdFormatPDF: 17,
      wdFormatXPS: 18,
      wdFormatFlatXML: 19,
      wdFormatFlatXMLMacroEnabled: 20,
      wdFormatFlatXMLTemplate: 21,
      wdFormatFlatXMLTemplateMacroEnabled: 22,
      wdFormatOpenDocumentText: 23,
      wdFormatStrictOpenXMLDocument: 24,
    },
    WdRelativeHorizontalPosition: {
      // 相对于字符
      wdRelativeHorizontalPositionCharacter: 3,
      // 相对于列
      wdRelativeHorizontalPositionColumn: 2,
      // 相对于边距
      wdRelativeHorizontalPositionMargin: 0,
      // 相对于页面
      wdRelativeHorizontalPositionPage: 1,
      // 相对于内空白区
      wdRelativeHorizontalPositionInnerMarginArea: 6,
      // 相对于左边距
      wdRelativeHorizontalPositionLeftMarginArea: 4,
      // 相对于外空白区
      wdRelativeHorizontalPositionOuterMarginArea: 7,
      // 相对于右边距
      wdRelativeHorizontalPositionRightMarginArea: 5,
    },
    WdProtectionType: {
      wdNoProtection: -1,
      wdAllowOnlyRevisions: 0,
      wdAllowOnlyComments: 1,
      wdAllowOnlyFormFields: 2,
      wdAllowOnlyReading: 3,
    },
  },
};
