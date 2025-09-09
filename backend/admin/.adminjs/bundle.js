(function (React, reactRedux, designSystem, styledComponents, adminjs) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  const Wrapper = styledComponents.styled(designSystem.Box)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;
  const StyledLogo = styledComponents.styled.img`
  max-width: 200px;
  margin: ${designSystem.themeGet('space', 'md')} 0;
`;
  const IllustrationsWrapper = styledComponents.styled(designSystem.Box)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  & svg [stroke='#3B3552'] {
    stroke: rgba(255, 255, 255, 0.5);
  }
  & svg [fill='#3040D6'] {
    fill: rgba(255, 255, 255, 1);
  }
`;
  const Login = () => {
    const props = window.__APP_STATE__;
    const {
      action,
      errorMessage
    } = props;
    const {
      translateComponent,
      translateMessage
    } = adminjs.useTranslation();
    const branding = reactRedux.useSelector(state => state.branding);
    return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(Wrapper, {
      flex: true,
      variant: "grey"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      bg: "white",
      height: "480px",
      flex: true,
      boxShadow: "login",
      width: [1, 2 / 3, 'auto']
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      bg: "primary100",
      color: "white",
      p: "x3",
      width: "380px",
      flexGrow: 0,
      display: ['none', 'none', 'block'],
      position: "relative"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
      fontWeight: "lighter"
    }, "GENTRAIN Admin"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontWeight: "lighter",
      mt: "default"
    }, "Welcome to the GENTRAIN admin panel."), /*#__PURE__*/React__default.default.createElement(IllustrationsWrapper, {
      p: "xxl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "inline",
      mr: "default"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Illustration, {
      variant: "Planet",
      width: 82,
      height: 91
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "inline"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Illustration, {
      variant: "Astronaut",
      width: 82,
      height: 91
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      display: "inline",
      position: "relative",
      top: "-20px"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Illustration, {
      variant: "FlagInCog",
      width: 82,
      height: 91
    })))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      as: "form",
      action: action,
      method: "POST",
      p: "x3",
      flexGrow: 1,
      width: ['100%', '100%', '480px']
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
      marginBottom: "xxl"
    }, branding.logo ? /*#__PURE__*/React__default.default.createElement(StyledLogo, {
      src: branding.logo,
      alt: branding.companyName
    }) : branding.companyName), errorMessage && (/*#__PURE__*/React__default.default.createElement(designSystem.MessageBox, {
      my: "lg",
      message: errorMessage.split(' ').length > 1 ? errorMessage : 'Wrong username and/or password',
      variant: "danger"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      required: true
    }, "Username"), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      name: "email",
      placeholder: "Username"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      required: true
    }, translateComponent('Login.properties.password')), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      type: "password",
      name: "password",
      placeholder: translateComponent('Login.properties.password'),
      autoComplete: "new-password"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      mt: "xl",
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      variant: "contained"
    }, translateComponent('Login.loginButton'))))), branding.withMadeWithLove ? (/*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "xxl"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.MadeWithLove, null))) : null));
  };

  const Dashboard = () => {
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "grey"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      p: "xl",
      textAlign: "center"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H1, {
      fontWeight: "lighter"
    }, "GENTRAIN Admin"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontWeight: "lighter",
      mt: "default"
    }, "Welcome to the GENTRAIN admin panel. Here you can manage the pathogen database, create users for the admin panel and assign user roles. Use the navigation on the left sidebar to access different sections.")));
  };

  const UploadSchemeComponent = props => {
    const {
      action,
      record,
      resource
    } = props;
    const [file, setFile] = React.useState(null);
    const sendNotice = adminjs.useNotice();
    const handleDrop = files => {
      if (files.length > 0) {
        setFile(files[0]);
      }
    };
    const handleSubmit = async () => {
      if (!file) {
        sendNotice({
          message: 'Please select a file.',
          type: 'error'
        });
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${resource.href}`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.notice) {
        sendNotice(data.notice);
      }
    };
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "card"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "Upload Scheme"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, "Choose a file from your computer."), /*#__PURE__*/React__default.default.createElement(designSystem.DropZone, {
      onChange: handleDrop
    }), file && (/*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      mt: "md"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, "Selected file: ", file.name))), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
      onClick: handleSubmit,
      mt: "md"
    }, "Upload"));
  };

  const Edit = ({ property, record, onChange }) => {
      const { translateProperty } = adminjs.useTranslation();
      const { params } = record;
      const { custom } = property;
      const path = adminjs.flat.get(params, custom.filePathProperty);
      const key = adminjs.flat.get(params, custom.keyProperty);
      const file = adminjs.flat.get(params, custom.fileProperty);
      const [originalKey, setOriginalKey] = React.useState(key);
      const [filesToUpload, setFilesToUpload] = React.useState([]);
      React.useEffect(() => {
          // it means means that someone hit save and new file has been uploaded
          // in this case fliesToUpload should be cleared.
          // This happens when user turns off redirect after new/edit
          if ((typeof key === 'string' && key !== originalKey)
              || (typeof key !== 'string' && !originalKey)
              || (typeof key !== 'string' && Array.isArray(key) && key.length !== originalKey.length)) {
              setOriginalKey(key);
              setFilesToUpload([]);
          }
      }, [key, originalKey]);
      const onUpload = (files) => {
          setFilesToUpload(files);
          onChange(custom.fileProperty, files);
      };
      const handleRemove = () => {
          onChange(custom.fileProperty, null);
      };
      const handleMultiRemove = (singleKey) => {
          const index = (adminjs.flat.get(record.params, custom.keyProperty) || []).indexOf(singleKey);
          const filesToDelete = adminjs.flat.get(record.params, custom.filesToDeleteProperty) || [];
          if (path && path.length > 0) {
              const newPath = path.map((currentPath, i) => (i !== index ? currentPath : null));
              let newParams = adminjs.flat.set(record.params, custom.filesToDeleteProperty, [...filesToDelete, index]);
              newParams = adminjs.flat.set(newParams, custom.filePathProperty, newPath);
              onChange({
                  ...record,
                  params: newParams,
              });
          }
          else {
              // eslint-disable-next-line no-console
              console.log('You cannot remove file when there are no uploaded files yet');
          }
      };
      return (React__default.default.createElement(designSystem.FormGroup, null,
          React__default.default.createElement(designSystem.Label, null, translateProperty(property.label, property.resourceId)),
          React__default.default.createElement(designSystem.DropZone, { onChange: onUpload, multiple: custom.multiple, validate: {
                  mimeTypes: custom.mimeTypes,
                  maxSize: custom.maxSize,
              }, files: filesToUpload }),
          !custom.multiple && key && path && !filesToUpload.length && file !== null && (React__default.default.createElement(designSystem.DropZoneItem, { filename: key, src: path, onRemove: handleRemove })),
          custom.multiple && key && key.length && path ? (React__default.default.createElement(React__default.default.Fragment, null, key.map((singleKey, index) => {
              // when we remove items we set only path index to nulls.
              // key is still there. This is because
              // we have to maintain all the indexes. So here we simply filter out elements which
              // were removed and display only what was left
              const currentPath = path[index];
              return currentPath ? (React__default.default.createElement(designSystem.DropZoneItem, { key: singleKey, filename: singleKey, src: path[index], onRemove: () => handleMultiRemove(singleKey) })) : '';
          }))) : ''));
  };

  const AudioMimeTypes = [
      'audio/aac',
      'audio/midi',
      'audio/x-midi',
      'audio/mpeg',
      'audio/ogg',
      'application/ogg',
      'audio/opus',
      'audio/wav',
      'audio/webm',
      'audio/3gpp2',
  ];
  const ImageMimeTypes = [
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/vnd.microsoft.icon',
      'image/tiff',
      'image/webp',
  ];

  // eslint-disable-next-line import/no-extraneous-dependencies
  const SingleFile = (props) => {
      const { name, path, mimeType, width } = props;
      if (path && path.length) {
          if (mimeType && ImageMimeTypes.includes(mimeType)) {
              return (React__default.default.createElement("img", { src: path, style: { maxHeight: width, maxWidth: width }, alt: name }));
          }
          if (mimeType && AudioMimeTypes.includes(mimeType)) {
              return (React__default.default.createElement("audio", { controls: true, src: path },
                  "Your browser does not support the",
                  React__default.default.createElement("code", null, "audio"),
                  React__default.default.createElement("track", { kind: "captions" })));
          }
      }
      return (React__default.default.createElement(designSystem.Box, null,
          React__default.default.createElement(designSystem.Button, { as: "a", href: path, ml: "default", size: "sm", rounded: true, target: "_blank" },
              React__default.default.createElement(designSystem.Icon, { icon: "DocumentDownload", color: "white", mr: "default" }),
              name)));
  };
  const File = ({ width, record, property }) => {
      const { custom } = property;
      let path = adminjs.flat.get(record?.params, custom.filePathProperty);
      if (!path) {
          return null;
      }
      const name = adminjs.flat.get(record?.params, custom.fileNameProperty ? custom.fileNameProperty : custom.keyProperty);
      const mimeType = custom.mimeTypeProperty
          && adminjs.flat.get(record?.params, custom.mimeTypeProperty);
      if (!property.custom.multiple) {
          if (custom.opts && custom.opts.baseUrl) {
              path = `${custom.opts.baseUrl}/${name}`;
          }
          return (React__default.default.createElement(SingleFile, { path: path, name: name, width: width, mimeType: mimeType }));
      }
      if (custom.opts && custom.opts.baseUrl) {
          const baseUrl = custom.opts.baseUrl || '';
          path = path.map((singlePath, index) => `${baseUrl}/${name[index]}`);
      }
      return (React__default.default.createElement(React__default.default.Fragment, null, path.map((singlePath, index) => (React__default.default.createElement(SingleFile, { key: singlePath, path: singlePath, name: name[index], width: width, mimeType: mimeType[index] })))));
  };

  const List = (props) => (React__default.default.createElement(File, { width: 100, ...props }));

  const Show = (props) => {
      const { property } = props;
      const { translateProperty } = adminjs.useTranslation();
      return (React__default.default.createElement(designSystem.FormGroup, null,
          React__default.default.createElement(designSystem.Label, null, translateProperty(property.label, property.resourceId)),
          React__default.default.createElement(File, { width: "100%", ...props })));
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.Login = Login;
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.FileUpload = UploadSchemeComponent;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;

})(React, ReactRedux, AdminJSDesignSystem, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0ZpbGVVcGxvYWQuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkRWRpdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvdHlwZXMvbWltZS10eXBlcy50eXBlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL2ZpbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50LmpzIiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVNlbGVjdG9yIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgQm94LCBINSwgSDIsIExhYmVsLCBJbGx1c3RyYXRpb24sIElucHV0LCBGb3JtR3JvdXAsIEJ1dHRvbiwgVGV4dCwgTWVzc2FnZUJveCwgTWFkZVdpdGhMb3ZlLCB0aGVtZUdldCwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQoQm94KSBgXHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGhlaWdodDogMTAwJTtcclxuYDtcbmNvbnN0IFN0eWxlZExvZ28gPSBzdHlsZWQuaW1nIGBcclxuICBtYXgtd2lkdGg6IDIwMHB4O1xyXG4gIG1hcmdpbjogJHt0aGVtZUdldCgnc3BhY2UnLCAnbWQnKX0gMDtcclxuYDtcbmNvbnN0IElsbHVzdHJhdGlvbnNXcmFwcGVyID0gc3R5bGVkKEJveCkgYFxyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC13cmFwOiB3cmFwO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgJiBzdmcgW3N0cm9rZT0nIzNCMzU1MiddIHtcclxuICAgIHN0cm9rZTogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpO1xyXG4gIH1cclxuICAmIHN2ZyBbZmlsbD0nIzMwNDBENiddIHtcclxuICAgIGZpbGw6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMSk7XHJcbiAgfVxyXG5gO1xuZXhwb3J0IGNvbnN0IExvZ2luID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb3BzID0gd2luZG93Ll9fQVBQX1NUQVRFX187XG4gICAgY29uc3QgeyBhY3Rpb24sIGVycm9yTWVzc2FnZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVDb21wb25lbnQsIHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgYnJhbmRpbmcgPSB1c2VTZWxlY3Rvcigoc3RhdGUpID0+IHN0YXRlLmJyYW5kaW5nKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV3JhcHBlciwgeyBmbGV4OiB0cnVlLCB2YXJpYW50OiBcImdyZXlcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwid2hpdGVcIiwgaGVpZ2h0OiBcIjQ4MHB4XCIsIGZsZXg6IHRydWUsIGJveFNoYWRvdzogXCJsb2dpblwiLCB3aWR0aDogWzEsIDIgLyAzLCAnYXV0byddIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwicHJpbWFyeTEwMFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBwOiBcIngzXCIsIHdpZHRoOiBcIjM4MHB4XCIsIGZsZXhHcm93OiAwLCBkaXNwbGF5OiBbJ25vbmUnLCAnbm9uZScsICdibG9jayddLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDIsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiLCBtdDogXCJkZWZhdWx0XCIgfSwgXCJXZWxjb21lIHRvIHRoZSBHRU5UUkFJTiBhZG1pbiBwYW5lbC5cIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWxsdXN0cmF0aW9uc1dyYXBwZXIsIHsgcDogXCJ4eGxcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgbXI6IFwiZGVmYXVsdFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJQbGFuZXRcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkFzdHJvbmF1dFwiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgdG9wOiBcIi0yMHB4XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkZsYWdJbkNvZ1wiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYXM6IFwiZm9ybVwiLCBhY3Rpb246IGFjdGlvbiwgbWV0aG9kOiBcIlBPU1RcIiwgcDogXCJ4M1wiLCBmbGV4R3JvdzogMSwgd2lkdGg6IFsnMTAwJScsICcxMDAlJywgJzQ4MHB4J10gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChINSwgeyBtYXJnaW5Cb3R0b206IFwieHhsXCIgfSwgYnJhbmRpbmcubG9nbyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3R5bGVkTG9nbywgeyBzcmM6IGJyYW5kaW5nLmxvZ28sIGFsdDogYnJhbmRpbmcuY29tcGFueU5hbWUgfSkgOiBicmFuZGluZy5jb21wYW55TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChNZXNzYWdlQm94LCB7IG15OiBcImxnXCIsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiAnV3JvbmcgdXNlcm5hbWUgYW5kL29yIHBhc3N3b3JkJywgdmFyaWFudDogXCJkYW5nZXJcIiB9KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgeyByZXF1aXJlZDogdHJ1ZSB9LCBcIlVzZXJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyBuYW1lOiBcImVtYWlsXCIsIHBsYWNlaG9sZGVyOiBcIlVzZXJuYW1lXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgcmVxdWlyZWQ6IHRydWUgfSwgdHJhbnNsYXRlQ29tcG9uZW50KCdMb2dpbi5wcm9wZXJ0aWVzLnBhc3N3b3JkJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyB0eXBlOiBcInBhc3N3b3JkXCIsIG5hbWU6IFwicGFzc3dvcmRcIiwgcGxhY2Vob2xkZXI6IHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ucHJvcGVydGllcy5wYXNzd29yZCcpLCBhdXRvQ29tcGxldGU6IFwibmV3LXBhc3N3b3JkXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRleHQsIHsgbXQ6IFwieGxcIiwgdGV4dEFsaWduOiBcImNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB2YXJpYW50OiBcImNvbnRhaW5lZFwiIH0sIHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ubG9naW5CdXR0b24nKSkpKSksXG4gICAgICAgICAgICBicmFuZGluZy53aXRoTWFkZVdpdGhMb3ZlID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IG10OiBcInh4bFwiIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWRlV2l0aExvdmUsIG51bGwpKSkgOiBudWxsKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IExvZ2luO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgSDEsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwiZ3JleVwiIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwid2hpdGVcIiwgcDogXCJ4bFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDEsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dCwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiwgbXQ6IFwiZGVmYXVsdFwiIH0sIFwiV2VsY29tZSB0byB0aGUgR0VOVFJBSU4gYWRtaW4gcGFuZWwuIEhlcmUgeW91IGNhbiBtYW5hZ2UgdGhlIHBhdGhvZ2VuIGRhdGFiYXNlLCBjcmVhdGUgdXNlcnMgZm9yIHRoZSBhZG1pbiBwYW5lbCBhbmQgYXNzaWduIHVzZXIgcm9sZXMuIFVzZSB0aGUgbmF2aWdhdGlvbiBvbiB0aGUgbGVmdCBzaWRlYmFyIHRvIGFjY2VzcyBkaWZmZXJlbnQgc2VjdGlvbnMuXCIpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBEcm9wWm9uZSwgSDUsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZU5vdGljZSB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgVXBsb2FkU2NoZW1lQ29tcG9uZW50ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBhY3Rpb24sIHJlY29yZCwgcmVzb3VyY2UgfSA9IHByb3BzO1xuICAgIGNvbnN0IFtmaWxlLCBzZXRGaWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHNlbmROb3RpY2UgPSB1c2VOb3RpY2UoKTtcbiAgICBjb25zdCBoYW5kbGVEcm9wID0gKGZpbGVzKSA9PiB7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZXRGaWxlKGZpbGVzWzBdKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgaGFuZGxlU3VibWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICBpZiAoIWZpbGUpIHtcbiAgICAgICAgICAgIHNlbmROb3RpY2UoeyBtZXNzYWdlOiAnUGxlYXNlIHNlbGVjdCBhIGZpbGUuJywgdHlwZTogJ2Vycm9yJyB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtyZXNvdXJjZS5ocmVmfWAsIHtcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgYm9keTogZm9ybURhdGEsXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICBpZiAoZGF0YS5ub3RpY2UpIHtcbiAgICAgICAgICAgIHNlbmROb3RpY2UoZGF0YS5ub3RpY2UpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwiY2FyZFwiIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDUsIG51bGwsIFwiVXBsb2FkIFNjaGVtZVwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCBudWxsLCBcIkNob29zZSBhIGZpbGUgZnJvbSB5b3VyIGNvbXB1dGVyLlwiKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZSwgeyBvbkNoYW5nZTogaGFuZGxlRHJvcCB9KSxcbiAgICAgICAgZmlsZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgbXQ6IFwibWRcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCBudWxsLFxuICAgICAgICAgICAgICAgIFwiU2VsZWN0ZWQgZmlsZTogXCIsXG4gICAgICAgICAgICAgICAgZmlsZS5uYW1lKSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBvbkNsaWNrOiBoYW5kbGVTdWJtaXQsIG10OiBcIm1kXCIgfSwgXCJVcGxvYWRcIikpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBVcGxvYWRTY2hlbWVDb21wb25lbnQ7XG4iLCJpbXBvcnQgeyBEcm9wWm9uZSwgRHJvcFpvbmVJdGVtLCBGb3JtR3JvdXAsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0LCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBFZGl0ID0gKHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSkgPT4ge1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlUHJvcGVydHkgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgeyBwYXJhbXMgfSA9IHJlY29yZDtcbiAgICBjb25zdCB7IGN1c3RvbSB9ID0gcHJvcGVydHk7XG4gICAgY29uc3QgcGF0aCA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHkpO1xuICAgIGNvbnN0IGtleSA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmtleVByb3BlcnR5KTtcbiAgICBjb25zdCBmaWxlID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20uZmlsZVByb3BlcnR5KTtcbiAgICBjb25zdCBbb3JpZ2luYWxLZXksIHNldE9yaWdpbmFsS2V5XSA9IHVzZVN0YXRlKGtleSk7XG4gICAgY29uc3QgW2ZpbGVzVG9VcGxvYWQsIHNldEZpbGVzVG9VcGxvYWRdID0gdXNlU3RhdGUoW10pO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIC8vIGl0IG1lYW5zIG1lYW5zIHRoYXQgc29tZW9uZSBoaXQgc2F2ZSBhbmQgbmV3IGZpbGUgaGFzIGJlZW4gdXBsb2FkZWRcbiAgICAgICAgLy8gaW4gdGhpcyBjYXNlIGZsaWVzVG9VcGxvYWQgc2hvdWxkIGJlIGNsZWFyZWQuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIHVzZXIgdHVybnMgb2ZmIHJlZGlyZWN0IGFmdGVyIG5ldy9lZGl0XG4gICAgICAgIGlmICgodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYga2V5ICE9PSBvcmlnaW5hbEtleSlcbiAgICAgICAgICAgIHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyAmJiAhb3JpZ2luYWxLZXkpXG4gICAgICAgICAgICB8fCAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgJiYgQXJyYXkuaXNBcnJheShrZXkpICYmIGtleS5sZW5ndGggIT09IG9yaWdpbmFsS2V5Lmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHNldE9yaWdpbmFsS2V5KGtleSk7XG4gICAgICAgICAgICBzZXRGaWxlc1RvVXBsb2FkKFtdKTtcbiAgICAgICAgfVxuICAgIH0sIFtrZXksIG9yaWdpbmFsS2V5XSk7XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoZmlsZXMpID0+IHtcbiAgICAgICAgc2V0RmlsZXNUb1VwbG9hZChmaWxlcyk7XG4gICAgICAgIG9uQ2hhbmdlKGN1c3RvbS5maWxlUHJvcGVydHksIGZpbGVzKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgb25DaGFuZ2UoY3VzdG9tLmZpbGVQcm9wZXJ0eSwgbnVsbCk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVNdWx0aVJlbW92ZSA9IChzaW5nbGVLZXkpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSAoZmxhdC5nZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmtleVByb3BlcnR5KSB8fCBbXSkuaW5kZXhPZihzaW5nbGVLZXkpO1xuICAgICAgICBjb25zdCBmaWxlc1RvRGVsZXRlID0gZmxhdC5nZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmZpbGVzVG9EZWxldGVQcm9wZXJ0eSkgfHwgW107XG4gICAgICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGgubWFwKChjdXJyZW50UGF0aCwgaSkgPT4gKGkgIT09IGluZGV4ID8gY3VycmVudFBhdGggOiBudWxsKSk7XG4gICAgICAgICAgICBsZXQgbmV3UGFyYW1zID0gZmxhdC5zZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmZpbGVzVG9EZWxldGVQcm9wZXJ0eSwgWy4uLmZpbGVzVG9EZWxldGUsIGluZGV4XSk7XG4gICAgICAgICAgICBuZXdQYXJhbXMgPSBmbGF0LnNldChuZXdQYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5LCBuZXdQYXRoKTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAuLi5yZWNvcmQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBuZXdQYXJhbXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGNhbm5vdCByZW1vdmUgZmlsZSB3aGVuIHRoZXJlIGFyZSBubyB1cGxvYWRlZCBmaWxlcyB5ZXQnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgdHJhbnNsYXRlUHJvcGVydHkocHJvcGVydHkubGFiZWwsIHByb3BlcnR5LnJlc291cmNlSWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZSwgeyBvbkNoYW5nZTogb25VcGxvYWQsIG11bHRpcGxlOiBjdXN0b20ubXVsdGlwbGUsIHZhbGlkYXRlOiB7XG4gICAgICAgICAgICAgICAgbWltZVR5cGVzOiBjdXN0b20ubWltZVR5cGVzLFxuICAgICAgICAgICAgICAgIG1heFNpemU6IGN1c3RvbS5tYXhTaXplLFxuICAgICAgICAgICAgfSwgZmlsZXM6IGZpbGVzVG9VcGxvYWQgfSksXG4gICAgICAgICFjdXN0b20ubXVsdGlwbGUgJiYga2V5ICYmIHBhdGggJiYgIWZpbGVzVG9VcGxvYWQubGVuZ3RoICYmIGZpbGUgIT09IG51bGwgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGZpbGVuYW1lOiBrZXksIHNyYzogcGF0aCwgb25SZW1vdmU6IGhhbmRsZVJlbW92ZSB9KSksXG4gICAgICAgIGN1c3RvbS5tdWx0aXBsZSAmJiBrZXkgJiYga2V5Lmxlbmd0aCAmJiBwYXRoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIGtleS5tYXAoKHNpbmdsZUtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIC8vIHdoZW4gd2UgcmVtb3ZlIGl0ZW1zIHdlIHNldCBvbmx5IHBhdGggaW5kZXggdG8gbnVsbHMuXG4gICAgICAgICAgICAvLyBrZXkgaXMgc3RpbGwgdGhlcmUuIFRoaXMgaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBtYWludGFpbiBhbGwgdGhlIGluZGV4ZXMuIFNvIGhlcmUgd2Ugc2ltcGx5IGZpbHRlciBvdXQgZWxlbWVudHMgd2hpY2hcbiAgICAgICAgICAgIC8vIHdlcmUgcmVtb3ZlZCBhbmQgZGlzcGxheSBvbmx5IHdoYXQgd2FzIGxlZnRcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gcGF0aFtpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFBhdGggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsga2V5OiBzaW5nbGVLZXksIGZpbGVuYW1lOiBzaW5nbGVLZXksIHNyYzogcGF0aFtpbmRleF0sIG9uUmVtb3ZlOiAoKSA9PiBoYW5kbGVNdWx0aVJlbW92ZShzaW5nbGVLZXkpIH0pKSA6ICcnO1xuICAgICAgICB9KSkpIDogJycpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBFZGl0O1xuIiwiZXhwb3J0IGNvbnN0IEF1ZGlvTWltZVR5cGVzID0gW1xuICAgICdhdWRpby9hYWMnLFxuICAgICdhdWRpby9taWRpJyxcbiAgICAnYXVkaW8veC1taWRpJyxcbiAgICAnYXVkaW8vbXBlZycsXG4gICAgJ2F1ZGlvL29nZycsXG4gICAgJ2FwcGxpY2F0aW9uL29nZycsXG4gICAgJ2F1ZGlvL29wdXMnLFxuICAgICdhdWRpby93YXYnLFxuICAgICdhdWRpby93ZWJtJyxcbiAgICAnYXVkaW8vM2dwcDInLFxuXTtcbmV4cG9ydCBjb25zdCBWaWRlb01pbWVUeXBlcyA9IFtcbiAgICAndmlkZW8veC1tc3ZpZGVvJyxcbiAgICAndmlkZW8vbXBlZycsXG4gICAgJ3ZpZGVvL29nZycsXG4gICAgJ3ZpZGVvL21wMnQnLFxuICAgICd2aWRlby93ZWJtJyxcbiAgICAndmlkZW8vM2dwcCcsXG4gICAgJ3ZpZGVvLzNncHAyJyxcbl07XG5leHBvcnQgY29uc3QgSW1hZ2VNaW1lVHlwZXMgPSBbXG4gICAgJ2ltYWdlL2JtcCcsXG4gICAgJ2ltYWdlL2dpZicsXG4gICAgJ2ltYWdlL2pwZWcnLFxuICAgICdpbWFnZS9wbmcnLFxuICAgICdpbWFnZS9zdmcreG1sJyxcbiAgICAnaW1hZ2Uvdm5kLm1pY3Jvc29mdC5pY29uJyxcbiAgICAnaW1hZ2UvdGlmZicsXG4gICAgJ2ltYWdlL3dlYnAnLFxuXTtcbmV4cG9ydCBjb25zdCBDb21wcmVzc2VkTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi94LWJ6aXAnLFxuICAgICdhcHBsaWNhdGlvbi94LWJ6aXAyJyxcbiAgICAnYXBwbGljYXRpb24vZ3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZScsXG4gICAgJ2FwcGxpY2F0aW9uL3gtdGFyJyxcbiAgICAnYXBwbGljYXRpb24vemlwJyxcbiAgICAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJyxcbl07XG5leHBvcnQgY29uc3QgRG9jdW1lbnRNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtYWJpd29yZCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtZnJlZWFyYycsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5hbWF6b24uZWJvb2snLFxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLnJhcicsXG4gICAgJ2FwcGxpY2F0aW9uL3J0ZicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0Jyxcbl07XG5leHBvcnQgY29uc3QgVGV4dE1pbWVUeXBlcyA9IFtcbiAgICAndGV4dC9jc3MnLFxuICAgICd0ZXh0L2NzdicsXG4gICAgJ3RleHQvaHRtbCcsXG4gICAgJ3RleHQvY2FsZW5kYXInLFxuICAgICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnYXBwbGljYXRpb24vbGQranNvbicsXG4gICAgJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgJ3RleHQvcGxhaW4nLFxuICAgICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94bWwnLFxuICAgICd0ZXh0L3htbCcsXG5dO1xuZXhwb3J0IGNvbnN0IEJpbmFyeURvY3NNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL2VwdWIremlwJyxcbiAgICAnYXBwbGljYXRpb24vcGRmJyxcbl07XG5leHBvcnQgY29uc3QgRm9udE1pbWVUeXBlcyA9IFtcbiAgICAnZm9udC9vdGYnLFxuICAgICdmb250L3R0ZicsXG4gICAgJ2ZvbnQvd29mZicsXG4gICAgJ2ZvbnQvd29mZjInLFxuXTtcbmV4cG9ydCBjb25zdCBPdGhlck1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICAnYXBwbGljYXRpb24veC1jc2gnLFxuICAgICdhcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJyxcbiAgICAnYXBwbGljYXRpb24veC1zaCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJyxcbiAgICAndm5kLnZpc2lvJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbCcsXG5dO1xuZXhwb3J0IGNvbnN0IE1pbWVUeXBlcyA9IFtcbiAgICAuLi5BdWRpb01pbWVUeXBlcyxcbiAgICAuLi5WaWRlb01pbWVUeXBlcyxcbiAgICAuLi5JbWFnZU1pbWVUeXBlcyxcbiAgICAuLi5Db21wcmVzc2VkTWltZVR5cGVzLFxuICAgIC4uLkRvY3VtZW50TWltZVR5cGVzLFxuICAgIC4uLlRleHRNaW1lVHlwZXMsXG4gICAgLi4uQmluYXJ5RG9jc01pbWVUeXBlcyxcbiAgICAuLi5PdGhlck1pbWVUeXBlcyxcbiAgICAuLi5Gb250TWltZVR5cGVzLFxuICAgIC4uLk90aGVyTWltZVR5cGVzLFxuXTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0IH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXVkaW9NaW1lVHlwZXMsIEltYWdlTWltZVR5cGVzIH0gZnJvbSAnLi4vdHlwZXMvbWltZS10eXBlcy50eXBlLmpzJztcbmNvbnN0IFNpbmdsZUZpbGUgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IG5hbWUsIHBhdGgsIG1pbWVUeXBlLCB3aWR0aCB9ID0gcHJvcHM7XG4gICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1pbWVUeXBlICYmIEltYWdlTWltZVR5cGVzLmluY2x1ZGVzKG1pbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBwYXRoLCBzdHlsZTogeyBtYXhIZWlnaHQ6IHdpZHRoLCBtYXhXaWR0aDogd2lkdGggfSwgYWx0OiBuYW1lIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWltZVR5cGUgJiYgQXVkaW9NaW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiLCB7IGNvbnRyb2xzOiB0cnVlLCBzcmM6IHBhdGggfSxcbiAgICAgICAgICAgICAgICBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZVwiLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIsIG51bGwsIFwiYXVkaW9cIiksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyYWNrXCIsIHsga2luZDogXCJjYXB0aW9uc1wiIH0pKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYXM6IFwiYVwiLCBocmVmOiBwYXRoLCBtbDogXCJkZWZhdWx0XCIsIHNpemU6IFwic21cIiwgcm91bmRlZDogdHJ1ZSwgdGFyZ2V0OiBcIl9ibGFua1wiIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHsgaWNvbjogXCJEb2N1bWVudERvd25sb2FkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1yOiBcImRlZmF1bHRcIiB9KSxcbiAgICAgICAgICAgIG5hbWUpKSk7XG59O1xuY29uc3QgRmlsZSA9ICh7IHdpZHRoLCByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBjb25zdCB7IGN1c3RvbSB9ID0gcHJvcGVydHk7XG4gICAgbGV0IHBhdGggPSBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHkpO1xuICAgIGlmICghcGF0aCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbmFtZSA9IGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20uZmlsZU5hbWVQcm9wZXJ0eSA/IGN1c3RvbS5maWxlTmFtZVByb3BlcnR5IDogY3VzdG9tLmtleVByb3BlcnR5KTtcbiAgICBjb25zdCBtaW1lVHlwZSA9IGN1c3RvbS5taW1lVHlwZVByb3BlcnR5XG4gICAgICAgICYmIGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20ubWltZVR5cGVQcm9wZXJ0eSk7XG4gICAgaWYgKCFwcm9wZXJ0eS5jdXN0b20ubXVsdGlwbGUpIHtcbiAgICAgICAgaWYgKGN1c3RvbS5vcHRzICYmIGN1c3RvbS5vcHRzLmJhc2VVcmwpIHtcbiAgICAgICAgICAgIHBhdGggPSBgJHtjdXN0b20ub3B0cy5iYXNlVXJsfS8ke25hbWV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRmlsZSwgeyBwYXRoOiBwYXRoLCBuYW1lOiBuYW1lLCB3aWR0aDogd2lkdGgsIG1pbWVUeXBlOiBtaW1lVHlwZSB9KSk7XG4gICAgfVxuICAgIGlmIChjdXN0b20ub3B0cyAmJiBjdXN0b20ub3B0cy5iYXNlVXJsKSB7XG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBjdXN0b20ub3B0cy5iYXNlVXJsIHx8ICcnO1xuICAgICAgICBwYXRoID0gcGF0aC5tYXAoKHNpbmdsZVBhdGgsIGluZGV4KSA9PiBgJHtiYXNlVXJsfS8ke25hbWVbaW5kZXhdfWApO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIHBhdGgubWFwKChzaW5nbGVQYXRoLCBpbmRleCkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRmlsZSwgeyBrZXk6IHNpbmdsZVBhdGgsIHBhdGg6IHNpbmdsZVBhdGgsIG5hbWU6IG5hbWVbaW5kZXhdLCB3aWR0aDogd2lkdGgsIG1pbWVUeXBlOiBtaW1lVHlwZVtpbmRleF0gfSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEZpbGU7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJztcbmNvbnN0IExpc3QgPSAocHJvcHMpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGUsIHsgd2lkdGg6IDEwMCwgLi4ucHJvcHMgfSkpO1xuZXhwb3J0IGRlZmF1bHQgTGlzdDtcbiIsImltcG9ydCB7IEZvcm1Hcm91cCwgTGFiZWwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJztcbmNvbnN0IFNob3cgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHByb3BlcnR5IH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zbGF0ZVByb3BlcnR5IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHRyYW5zbGF0ZVByb3BlcnR5KHByb3BlcnR5LmxhYmVsLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZSwgeyB3aWR0aDogXCIxMDAlXCIsIC4uLnByb3BzIH0pKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hvdztcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IExvZ2luIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9Mb2dpbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9naW4gPSBMb2dpblxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBGaWxlVXBsb2FkIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9GaWxlVXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5GaWxlVXBsb2FkID0gRmlsZVVwbG9hZFxuaW1wb3J0IFVwbG9hZEVkaXRDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZEVkaXRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZEVkaXRDb21wb25lbnQgPSBVcGxvYWRFZGl0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkTGlzdENvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkTGlzdENvbXBvbmVudCA9IFVwbG9hZExpc3RDb21wb25lbnRcbmltcG9ydCBVcGxvYWRTaG93Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRTaG93Q29tcG9uZW50ID0gVXBsb2FkU2hvd0NvbXBvbmVudCJdLCJuYW1lcyI6WyJXcmFwcGVyIiwic3R5bGVkIiwiQm94IiwiU3R5bGVkTG9nbyIsImltZyIsInRoZW1lR2V0IiwiSWxsdXN0cmF0aW9uc1dyYXBwZXIiLCJMb2dpbiIsInByb3BzIiwid2luZG93IiwiX19BUFBfU1RBVEVfXyIsImFjdGlvbiIsImVycm9yTWVzc2FnZSIsInRyYW5zbGF0ZUNvbXBvbmVudCIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImJyYW5kaW5nIiwidXNlU2VsZWN0b3IiLCJzdGF0ZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwiZmxleCIsInZhcmlhbnQiLCJiZyIsImhlaWdodCIsImJveFNoYWRvdyIsIndpZHRoIiwiY29sb3IiLCJwIiwiZmxleEdyb3ciLCJkaXNwbGF5IiwicG9zaXRpb24iLCJIMiIsImZvbnRXZWlnaHQiLCJUZXh0IiwibXQiLCJtciIsIklsbHVzdHJhdGlvbiIsInRvcCIsImFzIiwibWV0aG9kIiwiSDUiLCJtYXJnaW5Cb3R0b20iLCJsb2dvIiwic3JjIiwiYWx0IiwiY29tcGFueU5hbWUiLCJNZXNzYWdlQm94IiwibXkiLCJtZXNzYWdlIiwic3BsaXQiLCJsZW5ndGgiLCJGb3JtR3JvdXAiLCJMYWJlbCIsInJlcXVpcmVkIiwiSW5wdXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwiYXV0b0NvbXBsZXRlIiwidGV4dEFsaWduIiwiQnV0dG9uIiwid2l0aE1hZGVXaXRoTG92ZSIsIk1hZGVXaXRoTG92ZSIsIkRhc2hib2FyZCIsIkgxIiwiVXBsb2FkU2NoZW1lQ29tcG9uZW50IiwicmVjb3JkIiwicmVzb3VyY2UiLCJmaWxlIiwic2V0RmlsZSIsInVzZVN0YXRlIiwic2VuZE5vdGljZSIsInVzZU5vdGljZSIsImhhbmRsZURyb3AiLCJmaWxlcyIsImhhbmRsZVN1Ym1pdCIsImZvcm1EYXRhIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJyZXNwb25zZSIsImZldGNoIiwiaHJlZiIsImJvZHkiLCJkYXRhIiwianNvbiIsIm5vdGljZSIsIkRyb3Bab25lIiwib25DaGFuZ2UiLCJvbkNsaWNrIiwiZmxhdCIsInVzZUVmZmVjdCIsIkRyb3Bab25lSXRlbSIsIkljb24iLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJGaWxlVXBsb2FkIiwiVXBsb2FkRWRpdENvbXBvbmVudCIsIlVwbG9hZExpc3RDb21wb25lbnQiLCJVcGxvYWRTaG93Q29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBS0EsTUFBTUEsT0FBTyxHQUFHQyx1QkFBTSxDQUFDQyxnQkFBRyxDQUFFO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztFQUNELE1BQU1DLFVBQVUsR0FBR0YsdUJBQU0sQ0FBQ0csR0FBSTtBQUM5QjtBQUNBLFVBQUEsRUFBWUMscUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDbkMsQ0FBQztFQUNELE1BQU1DLG9CQUFvQixHQUFHTCx1QkFBTSxDQUFDQyxnQkFBRyxDQUFFO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztFQUNNLE1BQU1LLEtBQUssR0FBR0EsTUFBTTtFQUN2QixFQUFBLE1BQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxhQUFhO0lBQ2xDLE1BQU07TUFBRUMsTUFBTTtFQUFFQyxJQUFBQTtFQUFhLEdBQUMsR0FBR0osS0FBSztJQUN0QyxNQUFNO01BQUVLLGtCQUFrQjtFQUFFQyxJQUFBQTtLQUFrQixHQUFHQyxzQkFBYyxFQUFFO0lBQ2pFLE1BQU1DLFFBQVEsR0FBR0Msc0JBQVcsQ0FBRUMsS0FBSyxJQUFLQSxLQUFLLENBQUNGLFFBQVEsQ0FBQztFQUN2RCxFQUFBLG9CQUFRRyxzQkFBSyxDQUFDQyxhQUFhLENBQUNELHNCQUFLLENBQUNFLFFBQVEsRUFBRSxJQUFJLGVBQzVDRixzQkFBSyxDQUFDQyxhQUFhLENBQUNwQixPQUFPLEVBQUU7RUFBRXNCLElBQUFBLElBQUksRUFBRSxJQUFJO0VBQUVDLElB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
