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
      message: errorMessage.split(' ').length > 1 ? errorMessage : translateMessage(errorMessage),
      variant: "danger"
    })), /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      required: true
    }, translateComponent('Login.properties.email')), /*#__PURE__*/React__default.default.createElement(designSystem.Input, {
      name: "email",
      placeholder: translateComponent('Login.properties.email')
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

  const SchemeUpload = props => {
    const {
      onChange,
      property,
      record
    } = props;
    const [_, setFile] = React.useState(null);
    const schemeSize = record.params.scheme_size;
    const schemeVersion = record.params.scheme_version;
    const handleDrop = files => {
      if (files.length > 0) {
        setFile(files[0]);
        onChange(property.name, files[0]);
      }
    };
    const errorMessage = record?.errors?.[property.name]?.message;
    return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      style: {
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      htmlFor: property.path
    }, property.isRequired && (/*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      display: "inline",
      color: "primary100"
    }, "*", ' ')), property.custom.label), schemeSize && schemeVersion && (/*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      style: {
        alignItems: 'center'
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm"
    }, "Current scheme (", schemeSize, ") was uploaded on ", schemeVersion)))), errorMessage && (/*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontSize: "sm",
      color: "error"
    }, errorMessage)), /*#__PURE__*/React__default.default.createElement(designSystem.DropZone, {
      onChange: handleDrop
    })), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, "\u00A0"));
  };

  const SchemeTypeSelectEdit = props => {
    const {
      record,
      property,
      onChange
    } = props;
    const error = record.errors?.[property.path];
    const {
      tm
    } = adminjs.useTranslation();
    if (!property.availableValues) {
      return null;
    }
    const propValue = record.params?.[property.path] ?? property.props.value ?? '';
    const availableValues = property.availableValues.map(v => ({
      ...v,
      label: tm(`${property.path}.${v.value}`, property.resourceId, {
        defaultValue: v.label ?? v.value
      })
    }));
    const selected = availableValues.find(av => av.value == propValue);
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
      error: Boolean(error)
    }, /*#__PURE__*/React__default.default.createElement(adminjs.PropertyLabel, {
      property: property
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Select, {
      value: selected,
      options: availableValues,
      onChange: s => onChange(property.path, s?.value ?? ''),
      isDisabled: record.params.id ? true : false,
      ...property.props
    }), ' ', /*#__PURE__*/React__default.default.createElement(designSystem.FormMessage, null, error && tm(error.message, property.resourceId)));
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
  AdminJS.UserComponents.SchemeUpload = SchemeUpload;
  AdminJS.UserComponents.SchemeTypeSelectEdit = SchemeTypeSelectEdit;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;

})(React, ReactRedux, AdminJSDesignSystem, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVVwbG9hZC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvZmlsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQuanMiLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBCb3gsIEg1LCBIMiwgTGFiZWwsIElsbHVzdHJhdGlvbiwgSW5wdXQsIEZvcm1Hcm91cCwgQnV0dG9uLCBUZXh0LCBNZXNzYWdlQm94LCBNYWRlV2l0aExvdmUsIHRoZW1lR2V0LCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgV3JhcHBlciA9IHN0eWxlZChCb3gpIGBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwJTtcbmA7XG5jb25zdCBTdHlsZWRMb2dvID0gc3R5bGVkLmltZyBgXG4gIG1heC13aWR0aDogMjAwcHg7XG4gIG1hcmdpbjogJHt0aGVtZUdldCgnc3BhY2UnLCAnbWQnKX0gMDtcbmA7XG5jb25zdCBJbGx1c3RyYXRpb25zV3JhcHBlciA9IHN0eWxlZChCb3gpIGBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgJiBzdmcgW3N0cm9rZT0nIzNCMzU1MiddIHtcbiAgICBzdHJva2U6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcbiAgfVxuICAmIHN2ZyBbZmlsbD0nIzMwNDBENiddIHtcbiAgICBmaWxsOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDEpO1xuICB9XG5gO1xuZXhwb3J0IGNvbnN0IExvZ2luID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb3BzID0gd2luZG93Ll9fQVBQX1NUQVRFX187XG4gICAgY29uc3QgeyBhY3Rpb24sIGVycm9yTWVzc2FnZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVDb21wb25lbnQsIHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgYnJhbmRpbmcgPSB1c2VTZWxlY3Rvcigoc3RhdGUpID0+IHN0YXRlLmJyYW5kaW5nKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV3JhcHBlciwgeyBmbGV4OiB0cnVlLCB2YXJpYW50OiBcImdyZXlcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwid2hpdGVcIiwgaGVpZ2h0OiBcIjQ4MHB4XCIsIGZsZXg6IHRydWUsIGJveFNoYWRvdzogXCJsb2dpblwiLCB3aWR0aDogWzEsIDIgLyAzLCAnYXV0byddIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwicHJpbWFyeTEwMFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBwOiBcIngzXCIsIHdpZHRoOiBcIjM4MHB4XCIsIGZsZXhHcm93OiAwLCBkaXNwbGF5OiBbJ25vbmUnLCAnbm9uZScsICdibG9jayddLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDIsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiLCBtdDogXCJkZWZhdWx0XCIgfSwgXCJXZWxjb21lIHRvIHRoZSBHRU5UUkFJTiBhZG1pbiBwYW5lbC5cIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWxsdXN0cmF0aW9uc1dyYXBwZXIsIHsgcDogXCJ4eGxcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgbXI6IFwiZGVmYXVsdFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJQbGFuZXRcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkFzdHJvbmF1dFwiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgdG9wOiBcIi0yMHB4XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkZsYWdJbkNvZ1wiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYXM6IFwiZm9ybVwiLCBhY3Rpb246IGFjdGlvbiwgbWV0aG9kOiBcIlBPU1RcIiwgcDogXCJ4M1wiLCBmbGV4R3JvdzogMSwgd2lkdGg6IFsnMTAwJScsICcxMDAlJywgJzQ4MHB4J10gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChINSwgeyBtYXJnaW5Cb3R0b206IFwieHhsXCIgfSwgYnJhbmRpbmcubG9nbyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3R5bGVkTG9nbywgeyBzcmM6IGJyYW5kaW5nLmxvZ28sIGFsdDogYnJhbmRpbmcuY29tcGFueU5hbWUgfSkgOiBicmFuZGluZy5jb21wYW55TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChNZXNzYWdlQm94LCB7IG15OiBcImxnXCIsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiB0cmFuc2xhdGVNZXNzYWdlKGVycm9yTWVzc2FnZSksIHZhcmlhbnQ6IFwiZGFuZ2VyXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgcmVxdWlyZWQ6IHRydWUgfSwgdHJhbnNsYXRlQ29tcG9uZW50KCdMb2dpbi5wcm9wZXJ0aWVzLmVtYWlsJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyBuYW1lOiBcImVtYWlsXCIsIHBsYWNlaG9sZGVyOiB0cmFuc2xhdGVDb21wb25lbnQoJ0xvZ2luLnByb3BlcnRpZXMuZW1haWwnKSB9KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgeyByZXF1aXJlZDogdHJ1ZSB9LCB0cmFuc2xhdGVDb21wb25lbnQoJ0xvZ2luLnByb3BlcnRpZXMucGFzc3dvcmQnKSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElucHV0LCB7IHR5cGU6IFwicGFzc3dvcmRcIiwgbmFtZTogXCJwYXNzd29yZFwiLCBwbGFjZWhvbGRlcjogdHJhbnNsYXRlQ29tcG9uZW50KCdMb2dpbi5wcm9wZXJ0aWVzLnBhc3N3b3JkJyksIGF1dG9Db21wbGV0ZTogXCJuZXctcGFzc3dvcmRcIiB9KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dCwgeyBtdDogXCJ4bFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IHZhcmlhbnQ6IFwiY29udGFpbmVkXCIgfSwgdHJhbnNsYXRlQ29tcG9uZW50KCdMb2dpbi5sb2dpbkJ1dHRvbicpKSkpKSxcbiAgICAgICAgICAgIGJyYW5kaW5nLndpdGhNYWRlV2l0aExvdmUgPyAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgbXQ6IFwieHhsXCIgfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE1hZGVXaXRoTG92ZSwgbnVsbCkpKSA6IG51bGwpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgTG9naW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBIMSwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgdmFyaWFudDogXCJncmV5XCIgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgdmFyaWFudDogXCJ3aGl0ZVwiLCBwOiBcInhsXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIMSwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiB9LCBcIkdFTlRSQUlOIEFkbWluXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiLCBtdDogXCJkZWZhdWx0XCIgfSwgXCJXZWxjb21lIHRvIHRoZSBHRU5UUkFJTiBhZG1pbiBwYW5lbC4gSGVyZSB5b3UgY2FuIG1hbmFnZSB0aGUgcGF0aG9nZW4gZGF0YWJhc2UsIGNyZWF0ZSB1c2VycyBmb3IgdGhlIGFkbWluIHBhbmVsIGFuZCBhc3NpZ24gdXNlciByb2xlcy4gVXNlIHRoZSBuYXZpZ2F0aW9uIG9uIHRoZSBsZWZ0IHNpZGViYXIgdG8gYWNjZXNzIGRpZmZlcmVudCBzZWN0aW9ucy5cIikpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBEcm9wWm9uZSwgTGFiZWwsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmNvbnN0IFNjaGVtZVVwbG9hZCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgb25DaGFuZ2UsIHByb3BlcnR5LCByZWNvcmQgfSA9IHByb3BzO1xuICAgIGNvbnN0IFtfLCBzZXRGaWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHNjaGVtZVNpemUgPSByZWNvcmQucGFyYW1zLnNjaGVtZV9zaXplO1xuICAgIGNvbnN0IHNjaGVtZVZlcnNpb24gPSByZWNvcmQucGFyYW1zLnNjaGVtZV92ZXJzaW9uO1xuICAgIGNvbnN0IGhhbmRsZURyb3AgPSAoZmlsZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNldEZpbGUoZmlsZXNbMF0pO1xuICAgICAgICAgICAgb25DaGFuZ2UocHJvcGVydHkubmFtZSwgZmlsZXNbMF0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSByZWNvcmQ/LmVycm9ycz8uW3Byb3BlcnR5Lm5hbWVdPy5tZXNzYWdlO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBmbGV4OiB0cnVlLCBzdHlsZTogeyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH0gfSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCB7IGh0bWxGb3I6IHByb3BlcnR5LnBhdGggfSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuaXNSZXF1aXJlZCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIsIGNvbG9yOiBcInByaW1hcnkxMDBcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAnICcpKSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkuY3VzdG9tLmxhYmVsKSxcbiAgICAgICAgICAgICAgICBzY2hlbWVTaXplICYmIHNjaGVtZVZlcnNpb24gJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXg6IHRydWUsIHN0eWxlOiB7IGFsaWduSXRlbXM6ICdjZW50ZXInIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRTaXplOiBcInNtXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQ3VycmVudCBzY2hlbWUgKFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1lU2l6ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiKSB3YXMgdXBsb2FkZWQgb24gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2hlbWVWZXJzaW9uKSkpKSxcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRTaXplOiBcInNtXCIsIGNvbG9yOiBcImVycm9yXCIgfSwgZXJyb3JNZXNzYWdlKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lLCB7IG9uQ2hhbmdlOiBoYW5kbGVEcm9wIH0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCBudWxsLCBcIlxcdTAwQTBcIikpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTY2hlbWVVcGxvYWQ7XG4iLCJpbXBvcnQgeyBQcm9wZXJ0eUxhYmVsLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UsIFNlbGVjdCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuY29uc3QgU2NoZW1lVHlwZVNlbGVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHJlY29yZCwgcHJvcGVydHksIG9uQ2hhbmdlIH0gPSBwcm9wcztcbiAgICBjb25zdCBlcnJvciA9IHJlY29yZC5lcnJvcnM/Lltwcm9wZXJ0eS5wYXRoXTtcbiAgICBjb25zdCB7IHRtIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGlmICghcHJvcGVydHkuYXZhaWxhYmxlVmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwcm9wVmFsdWUgPSByZWNvcmQucGFyYW1zPy5bcHJvcGVydHkucGF0aF0gPz8gcHJvcGVydHkucHJvcHMudmFsdWUgPz8gJyc7XG4gICAgY29uc3QgYXZhaWxhYmxlVmFsdWVzID0gcHJvcGVydHkuYXZhaWxhYmxlVmFsdWVzLm1hcCgodikgPT4gKHtcbiAgICAgICAgLi4udixcbiAgICAgICAgbGFiZWw6IHRtKGAke3Byb3BlcnR5LnBhdGh9LiR7di52YWx1ZX1gLCBwcm9wZXJ0eS5yZXNvdXJjZUlkLCB7IGRlZmF1bHRWYWx1ZTogdi5sYWJlbCA/PyB2LnZhbHVlIH0pLFxuICAgIH0pKTtcbiAgICBjb25zdCBzZWxlY3RlZCA9IGF2YWlsYWJsZVZhbHVlcy5maW5kKChhdikgPT4gYXYudmFsdWUgPT0gcHJvcFZhbHVlKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGVycm9yOiBCb29sZWFuKGVycm9yKSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3BlcnR5TGFiZWwsIHsgcHJvcGVydHk6IHByb3BlcnR5IH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwgeyB2YWx1ZTogc2VsZWN0ZWQsIG9wdGlvbnM6IGF2YWlsYWJsZVZhbHVlcywgb25DaGFuZ2U6IChzKSA9PiBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBzPy52YWx1ZSA/PyAnJyksIGlzRGlzYWJsZWQ6IHJlY29yZC5wYXJhbXMuaWQgPyB0cnVlIDogZmFsc2UsIC4uLnByb3BlcnR5LnByb3BzIH0pLFxuICAgICAgICAnICcsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybU1lc3NhZ2UsIG51bGwsIGVycm9yICYmIHRtKGVycm9yLm1lc3NhZ2UsIHByb3BlcnR5LnJlc291cmNlSWQpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtZVR5cGVTZWxlY3RFZGl0O1xuIiwiaW1wb3J0IHsgRHJvcFpvbmUsIERyb3Bab25lSXRlbSwgRm9ybUdyb3VwLCBMYWJlbCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuY29uc3QgRWRpdCA9ICh7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0pID0+IHtcbiAgICBjb25zdCB7IHRyYW5zbGF0ZVByb3BlcnR5IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IHsgcGFyYW1zIH0gPSByZWNvcmQ7XG4gICAgY29uc3QgeyBjdXN0b20gfSA9IHByb3BlcnR5O1xuICAgIGNvbnN0IHBhdGggPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5KTtcbiAgICBjb25zdCBrZXkgPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5rZXlQcm9wZXJ0eSk7XG4gICAgY29uc3QgZmlsZSA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmZpbGVQcm9wZXJ0eSk7XG4gICAgY29uc3QgW29yaWdpbmFsS2V5LCBzZXRPcmlnaW5hbEtleV0gPSB1c2VTdGF0ZShrZXkpO1xuICAgIGNvbnN0IFtmaWxlc1RvVXBsb2FkLCBzZXRGaWxlc1RvVXBsb2FkXSA9IHVzZVN0YXRlKFtdKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBpdCBtZWFucyBtZWFucyB0aGF0IHNvbWVvbmUgaGl0IHNhdmUgYW5kIG5ldyBmaWxlIGhhcyBiZWVuIHVwbG9hZGVkXG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSBmbGllc1RvVXBsb2FkIHNob3VsZCBiZSBjbGVhcmVkLlxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiB1c2VyIHR1cm5zIG9mZiByZWRpcmVjdCBhZnRlciBuZXcvZWRpdFxuICAgICAgICBpZiAoKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIGtleSAhPT0gb3JpZ2luYWxLZXkpXG4gICAgICAgICAgICB8fCAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgJiYgIW9yaWdpbmFsS2V5KVxuICAgICAgICAgICAgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnICYmIEFycmF5LmlzQXJyYXkoa2V5KSAmJiBrZXkubGVuZ3RoICE9PSBvcmlnaW5hbEtleS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBzZXRPcmlnaW5hbEtleShrZXkpO1xuICAgICAgICAgICAgc2V0RmlsZXNUb1VwbG9hZChbXSk7XG4gICAgICAgIH1cbiAgICB9LCBba2V5LCBvcmlnaW5hbEtleV0pO1xuICAgIGNvbnN0IG9uVXBsb2FkID0gKGZpbGVzKSA9PiB7XG4gICAgICAgIHNldEZpbGVzVG9VcGxvYWQoZmlsZXMpO1xuICAgICAgICBvbkNoYW5nZShjdXN0b20uZmlsZVByb3BlcnR5LCBmaWxlcyk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIG9uQ2hhbmdlKGN1c3RvbS5maWxlUHJvcGVydHksIG51bGwpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlTXVsdGlSZW1vdmUgPSAoc2luZ2xlS2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKGZsYXQuZ2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5rZXlQcm9wZXJ0eSkgfHwgW10pLmluZGV4T2Yoc2luZ2xlS2V5KTtcbiAgICAgICAgY29uc3QgZmlsZXNUb0RlbGV0ZSA9IGZsYXQuZ2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5maWxlc1RvRGVsZXRlUHJvcGVydHkpIHx8IFtdO1xuICAgICAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLm1hcCgoY3VycmVudFBhdGgsIGkpID0+IChpICE9PSBpbmRleCA/IGN1cnJlbnRQYXRoIDogbnVsbCkpO1xuICAgICAgICAgICAgbGV0IG5ld1BhcmFtcyA9IGZsYXQuc2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5maWxlc1RvRGVsZXRlUHJvcGVydHksIFsuLi5maWxlc1RvRGVsZXRlLCBpbmRleF0pO1xuICAgICAgICAgICAgbmV3UGFyYW1zID0gZmxhdC5zZXQobmV3UGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSwgbmV3UGF0aCk7XG4gICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgLi4ucmVjb3JkLFxuICAgICAgICAgICAgICAgIHBhcmFtczogbmV3UGFyYW1zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjYW5ub3QgcmVtb3ZlIGZpbGUgd2hlbiB0aGVyZSBhcmUgbm8gdXBsb2FkZWQgZmlsZXMgeWV0Jyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHRyYW5zbGF0ZVByb3BlcnR5KHByb3BlcnR5LmxhYmVsLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmUsIHsgb25DaGFuZ2U6IG9uVXBsb2FkLCBtdWx0aXBsZTogY3VzdG9tLm11bHRpcGxlLCB2YWxpZGF0ZToge1xuICAgICAgICAgICAgICAgIG1pbWVUeXBlczogY3VzdG9tLm1pbWVUeXBlcyxcbiAgICAgICAgICAgICAgICBtYXhTaXplOiBjdXN0b20ubWF4U2l6ZSxcbiAgICAgICAgICAgIH0sIGZpbGVzOiBmaWxlc1RvVXBsb2FkIH0pLFxuICAgICAgICAhY3VzdG9tLm11bHRpcGxlICYmIGtleSAmJiBwYXRoICYmICFmaWxlc1RvVXBsb2FkLmxlbmd0aCAmJiBmaWxlICE9PSBudWxsICYmIChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBmaWxlbmFtZToga2V5LCBzcmM6IHBhdGgsIG9uUmVtb3ZlOiBoYW5kbGVSZW1vdmUgfSkpLFxuICAgICAgICBjdXN0b20ubXVsdGlwbGUgJiYga2V5ICYmIGtleS5sZW5ndGggJiYgcGF0aCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBrZXkubWFwKChzaW5nbGVLZXksIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAvLyB3aGVuIHdlIHJlbW92ZSBpdGVtcyB3ZSBzZXQgb25seSBwYXRoIGluZGV4IHRvIG51bGxzLlxuICAgICAgICAgICAgLy8ga2V5IGlzIHN0aWxsIHRoZXJlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gbWFpbnRhaW4gYWxsIHRoZSBpbmRleGVzLiBTbyBoZXJlIHdlIHNpbXBseSBmaWx0ZXIgb3V0IGVsZW1lbnRzIHdoaWNoXG4gICAgICAgICAgICAvLyB3ZXJlIHJlbW92ZWQgYW5kIGRpc3BsYXkgb25seSB3aGF0IHdhcyBsZWZ0XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHBhdGhbaW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRQYXRoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGtleTogc2luZ2xlS2V5LCBmaWxlbmFtZTogc2luZ2xlS2V5LCBzcmM6IHBhdGhbaW5kZXhdLCBvblJlbW92ZTogKCkgPT4gaGFuZGxlTXVsdGlSZW1vdmUoc2luZ2xlS2V5KSB9KSkgOiAnJztcbiAgICAgICAgfSkpKSA6ICcnKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRWRpdDtcbiIsImV4cG9ydCBjb25zdCBBdWRpb01pbWVUeXBlcyA9IFtcbiAgICAnYXVkaW8vYWFjJyxcbiAgICAnYXVkaW8vbWlkaScsXG4gICAgJ2F1ZGlvL3gtbWlkaScsXG4gICAgJ2F1ZGlvL21wZWcnLFxuICAgICdhdWRpby9vZ2cnLFxuICAgICdhcHBsaWNhdGlvbi9vZ2cnLFxuICAgICdhdWRpby9vcHVzJyxcbiAgICAnYXVkaW8vd2F2JyxcbiAgICAnYXVkaW8vd2VibScsXG4gICAgJ2F1ZGlvLzNncHAyJyxcbl07XG5leHBvcnQgY29uc3QgVmlkZW9NaW1lVHlwZXMgPSBbXG4gICAgJ3ZpZGVvL3gtbXN2aWRlbycsXG4gICAgJ3ZpZGVvL21wZWcnLFxuICAgICd2aWRlby9vZ2cnLFxuICAgICd2aWRlby9tcDJ0JyxcbiAgICAndmlkZW8vd2VibScsXG4gICAgJ3ZpZGVvLzNncHAnLFxuICAgICd2aWRlby8zZ3BwMicsXG5dO1xuZXhwb3J0IGNvbnN0IEltYWdlTWltZVR5cGVzID0gW1xuICAgICdpbWFnZS9ibXAnLFxuICAgICdpbWFnZS9naWYnLFxuICAgICdpbWFnZS9qcGVnJyxcbiAgICAnaW1hZ2UvcG5nJyxcbiAgICAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgJ2ltYWdlL3ZuZC5taWNyb3NvZnQuaWNvbicsXG4gICAgJ2ltYWdlL3RpZmYnLFxuICAgICdpbWFnZS93ZWJwJyxcbl07XG5leHBvcnQgY29uc3QgQ29tcHJlc3NlZE1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24veC1iemlwJyxcbiAgICAnYXBwbGljYXRpb24veC1iemlwMicsXG4gICAgJ2FwcGxpY2F0aW9uL2d6aXAnLFxuICAgICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnLFxuICAgICdhcHBsaWNhdGlvbi94LXRhcicsXG4gICAgJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCcsXG5dO1xuZXhwb3J0IGNvbnN0IERvY3VtZW50TWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi94LWFiaXdvcmQnLFxuICAgICdhcHBsaWNhdGlvbi94LWZyZWVhcmMnLFxuICAgICdhcHBsaWNhdGlvbi92bmQuYW1hem9uLmVib29rJyxcbiAgICAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5yYXInLFxuICAgICdhcHBsaWNhdGlvbi9ydGYnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG5dO1xuZXhwb3J0IGNvbnN0IFRleHRNaW1lVHlwZXMgPSBbXG4gICAgJ3RleHQvY3NzJyxcbiAgICAndGV4dC9jc3YnLFxuICAgICd0ZXh0L2h0bWwnLFxuICAgICd0ZXh0L2NhbGVuZGFyJyxcbiAgICAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ2FwcGxpY2F0aW9uL2xkK2pzb24nLFxuICAgICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICd0ZXh0L3BsYWluJyxcbiAgICAnYXBwbGljYXRpb24veGh0bWwreG1sJyxcbiAgICAnYXBwbGljYXRpb24veG1sJyxcbiAgICAndGV4dC94bWwnLFxuXTtcbmV4cG9ydCBjb25zdCBCaW5hcnlEb2NzTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi9lcHViK3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3BkZicsXG5dO1xuZXhwb3J0IGNvbnN0IEZvbnRNaW1lVHlwZXMgPSBbXG4gICAgJ2ZvbnQvb3RmJyxcbiAgICAnZm9udC90dGYnLFxuICAgICdmb250L3dvZmYnLFxuICAgICdmb250L3dvZmYyJyxcbl07XG5leHBvcnQgY29uc3QgT3RoZXJNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgJ2FwcGxpY2F0aW9uL3gtY3NoJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLmFwcGxlLmluc3RhbGxlcit4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtc2gnLFxuICAgICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCcsXG4gICAgJ3ZuZC52aXNpbycsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tb3ppbGxhLnh1bCt4bWwnLFxuXTtcbmV4cG9ydCBjb25zdCBNaW1lVHlwZXMgPSBbXG4gICAgLi4uQXVkaW9NaW1lVHlwZXMsXG4gICAgLi4uVmlkZW9NaW1lVHlwZXMsXG4gICAgLi4uSW1hZ2VNaW1lVHlwZXMsXG4gICAgLi4uQ29tcHJlc3NlZE1pbWVUeXBlcyxcbiAgICAuLi5Eb2N1bWVudE1pbWVUeXBlcyxcbiAgICAuLi5UZXh0TWltZVR5cGVzLFxuICAgIC4uLkJpbmFyeURvY3NNaW1lVHlwZXMsXG4gICAgLi4uT3RoZXJNaW1lVHlwZXMsXG4gICAgLi4uRm9udE1pbWVUeXBlcyxcbiAgICAuLi5PdGhlck1pbWVUeXBlcyxcbl07XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEF1ZGlvTWltZVR5cGVzLCBJbWFnZU1pbWVUeXBlcyB9IGZyb20gJy4uL3R5cGVzL21pbWUtdHlwZXMudHlwZS5qcyc7XG5jb25zdCBTaW5nbGVGaWxlID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBuYW1lLCBwYXRoLCBtaW1lVHlwZSwgd2lkdGggfSA9IHByb3BzO1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtaW1lVHlwZSAmJiBJbWFnZU1pbWVUeXBlcy5pbmNsdWRlcyhtaW1lVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogcGF0aCwgc3R5bGU6IHsgbWF4SGVpZ2h0OiB3aWR0aCwgbWF4V2lkdGg6IHdpZHRoIH0sIGFsdDogbmFtZSB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbWVUeXBlICYmIEF1ZGlvTWltZVR5cGVzLmluY2x1ZGVzKG1pbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiwgeyBjb250cm9sczogdHJ1ZSwgc3JjOiBwYXRoIH0sXG4gICAgICAgICAgICAgICAgXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGVcIixcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcImF1ZGlvXCIpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0cmFja1wiLCB7IGtpbmQ6IFwiY2FwdGlvbnNcIiB9KSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGFzOiBcImFcIiwgaHJlZjogcGF0aCwgbWw6IFwiZGVmYXVsdFwiLCBzaXplOiBcInNtXCIsIHJvdW5kZWQ6IHRydWUsIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7IGljb246IFwiRG9jdW1lbnREb3dubG9hZFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBtcjogXCJkZWZhdWx0XCIgfSksXG4gICAgICAgICAgICBuYW1lKSkpO1xufTtcbmNvbnN0IEZpbGUgPSAoeyB3aWR0aCwgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgY29uc3QgeyBjdXN0b20gfSA9IHByb3BlcnR5O1xuICAgIGxldCBwYXRoID0gZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5KTtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5hbWUgPSBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLmZpbGVOYW1lUHJvcGVydHkgPyBjdXN0b20uZmlsZU5hbWVQcm9wZXJ0eSA6IGN1c3RvbS5rZXlQcm9wZXJ0eSk7XG4gICAgY29uc3QgbWltZVR5cGUgPSBjdXN0b20ubWltZVR5cGVQcm9wZXJ0eVxuICAgICAgICAmJiBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLm1pbWVUeXBlUHJvcGVydHkpO1xuICAgIGlmICghcHJvcGVydHkuY3VzdG9tLm11bHRpcGxlKSB7XG4gICAgICAgIGlmIChjdXN0b20ub3B0cyAmJiBjdXN0b20ub3B0cy5iYXNlVXJsKSB7XG4gICAgICAgICAgICBwYXRoID0gYCR7Y3VzdG9tLm9wdHMuYmFzZVVybH0vJHtuYW1lfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFNpbmdsZUZpbGUsIHsgcGF0aDogcGF0aCwgbmFtZTogbmFtZSwgd2lkdGg6IHdpZHRoLCBtaW1lVHlwZTogbWltZVR5cGUgfSkpO1xuICAgIH1cbiAgICBpZiAoY3VzdG9tLm9wdHMgJiYgY3VzdG9tLm9wdHMuYmFzZVVybCkge1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gY3VzdG9tLm9wdHMuYmFzZVVybCB8fCAnJztcbiAgICAgICAgcGF0aCA9IHBhdGgubWFwKChzaW5nbGVQYXRoLCBpbmRleCkgPT4gYCR7YmFzZVVybH0vJHtuYW1lW2luZGV4XX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBwYXRoLm1hcCgoc2luZ2xlUGF0aCwgaW5kZXgpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFNpbmdsZUZpbGUsIHsga2V5OiBzaW5nbGVQYXRoLCBwYXRoOiBzaW5nbGVQYXRoLCBuYW1lOiBuYW1lW2luZGV4XSwgd2lkdGg6IHdpZHRoLCBtaW1lVHlwZTogbWltZVR5cGVbaW5kZXhdIH0pKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBGaWxlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcyc7XG5jb25zdCBMaXN0ID0gKHByb3BzKSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlLCB7IHdpZHRoOiAxMDAsIC4uLnByb3BzIH0pKTtcbmV4cG9ydCBkZWZhdWx0IExpc3Q7XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcyc7XG5jb25zdCBTaG93ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBwcm9wZXJ0eSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVQcm9wZXJ0eSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCB0cmFuc2xhdGVQcm9wZXJ0eShwcm9wZXJ0eS5sYWJlbCwgcHJvcGVydHkucmVzb3VyY2VJZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGUsIHsgd2lkdGg6IFwiMTAwJVwiLCAuLi5wcm9wcyB9KSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNob3c7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBMb2dpbiBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgU2NoZW1lVXBsb2FkIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVVcGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNjaGVtZVVwbG9hZCA9IFNjaGVtZVVwbG9hZFxuaW1wb3J0IFNjaGVtZVR5cGVTZWxlY3RFZGl0IGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2NoZW1lVHlwZVNlbGVjdEVkaXQgPSBTY2hlbWVUeXBlU2VsZWN0RWRpdFxuaW1wb3J0IFVwbG9hZEVkaXRDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZEVkaXRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZEVkaXRDb21wb25lbnQgPSBVcGxvYWRFZGl0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkTGlzdENvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkTGlzdENvbXBvbmVudCA9IFVwbG9hZExpc3RDb21wb25lbnRcbmltcG9ydCBVcGxvYWRTaG93Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRTaG93Q29tcG9uZW50ID0gVXBsb2FkU2hvd0NvbXBvbmVudCJdLCJuYW1lcyI6WyJXcmFwcGVyIiwic3R5bGVkIiwiQm94IiwiU3R5bGVkTG9nbyIsImltZyIsInRoZW1lR2V0IiwiSWxsdXN0cmF0aW9uc1dyYXBwZXIiLCJMb2dpbiIsInByb3BzIiwid2luZG93IiwiX19BUFBfU1RBVEVfXyIsImFjdGlvbiIsImVycm9yTWVzc2FnZSIsInRyYW5zbGF0ZUNvbXBvbmVudCIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImJyYW5kaW5nIiwidXNlU2VsZWN0b3IiLCJzdGF0ZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwiZmxleCIsInZhcmlhbnQiLCJiZyIsImhlaWdodCIsImJveFNoYWRvdyIsIndpZHRoIiwiY29sb3IiLCJwIiwiZmxleEdyb3ciLCJkaXNwbGF5IiwicG9zaXRpb24iLCJIMiIsImZvbnRXZWlnaHQiLCJUZXh0IiwibXQiLCJtciIsIklsbHVzdHJhdGlvbiIsInRvcCIsImFzIiwibWV0aG9kIiwiSDUiLCJtYXJnaW5Cb3R0b20iLCJsb2dvIiwic3JjIiwiYWx0IiwiY29tcGFueU5hbWUiLCJNZXNzYWdlQm94IiwibXkiLCJtZXNzYWdlIiwic3BsaXQiLCJsZW5ndGgiLCJGb3JtR3JvdXAiLCJMYWJlbCIsInJlcXVpcmVkIiwiSW5wdXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwiYXV0b0NvbXBsZXRlIiwidGV4dEFsaWduIiwiQnV0dG9uIiwid2l0aE1hZGVXaXRoTG92ZSIsIk1hZGVXaXRoTG92ZSIsIkRhc2hib2FyZCIsIkgxIiwiU2NoZW1lVXBsb2FkIiwib25DaGFuZ2UiLCJwcm9wZXJ0eSIsInJlY29yZCIsIl8iLCJzZXRGaWxlIiwidXNlU3RhdGUiLCJzY2hlbWVTaXplIiwicGFyYW1zIiwic2NoZW1lX3NpemUiLCJzY2hlbWVWZXJzaW9uIiwic2NoZW1lX3ZlcnNpb24iLCJoYW5kbGVEcm9wIiwiZmlsZXMiLCJlcnJvcnMiLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiaHRtbEZvciIsInBhdGgiLCJpc1JlcXVpcmVkIiwiY3VzdG9tIiwibGFiZWwiLCJhbGlnbkl0ZW1zIiwiZm9udFNpemUiLCJEcm9wWm9uZSIsIlNjaGVtZVR5cGVTZWxlY3RFZGl0IiwiZXJyb3IiLCJ0bSIsImF2YWlsYWJsZVZhbHVlcyIsInByb3BWYWx1ZSIsInZhbHVlIiwibWFwIiwidiIsInJlc291cmNlSWQiLCJkZWZhdWx0VmFsdWUiLCJzZWxlY3RlZCIsImZpbmQiLCJhdiIsIkJvb2xlYW4iLCJQcm9wZXJ0eUxhYmVsIiwiU2VsZWN0Iiwib3B0aW9ucyIsInMiLCJpc0Rpc2FibGVkIiwiaWQiLCJGb3JtTWVzc2FnZSIsImZsYXQiLCJ1c2VFZmZlY3QiLCJEcm9wWm9uZUl0ZW0iLCJJY29uIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiVXBsb2FkRWRpdENvbXBvbmVudCIsIlVwbG9hZExpc3RDb21wb25lbnQiLCJVcGxvYWRTaG93Q29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBS0EsTUFBTUEsT0FBTyxHQUFHQyx1QkFBTSxDQUFDQyxnQkFBRyxDQUFFO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztFQUNELE1BQU1DLFVBQVUsR0FBR0YsdUJBQU0sQ0FBQ0csR0FBSTtBQUM5QjtBQUNBLFVBQUEsRUFBWUMscUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDbkMsQ0FBQztFQUNELE1BQU1DLG9CQUFvQixHQUFHTCx1QkFBTSxDQUFDQyxnQkFBRyxDQUFFO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztFQUNNLE1BQU1LLEtBQUssR0FBR0EsTUFBTTtFQUN2QixFQUFBLE1BQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxhQUFhO0lBQ2xDLE1BQU07TUFBRUMsTUFBTTtFQUFFQyxJQUFBQTtFQUFhLEdBQUMsR0FBR0osS0FBSztJQUN0QyxNQUFNO01BQUVLLGtCQUFrQjtFQUFFQyxJQUFBQTtLQUFrQixHQUFHQyxzQkFBYyxFQUFFO0lBQ2pFLE1BQU1DLFFBQVEsR0FBR0Msc0JBQVcsQ0FBRUMsS0FBSyxJQUFLQSxLQUFLLENBQUNGLFFBQVEsQ0FBQztFQUN2RCxFQUFBLG9CQUFRRyxzQkFB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
