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

  const LoggedIn = props => {
    const {
      session,
      paths
    } = props;
    const {
      translateButton
    } = adminjs.useTranslation();
    const dropActions = [{
      label: 'Edit profile',
      onClick: event => {
        event.preventDefault();
        window.location.href = `/admin/resources/user/records/${session.id}/edit`;
      },
      icon: 'User'
    }, {
      label: translateButton('logout'),
      onClick: event => {
        event.preventDefault();
        window.location.href = paths.logoutPath;
      },
      icon: 'LogOut'
    }];
    return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flexShrink: 0,
      "data-css": "logged-in"
    }, /*#__PURE__*/React__default.default.createElement(designSystem.CurrentUserNav, {
      name: session.email,
      title: session.title,
      avatarUrl: session.avatarUrl,
      dropActions: dropActions
    }));
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
    const schemeVersion = new Date(record.params.scheme_version).toLocaleString('de-DE', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
    const {
      tm
    } = adminjs.useTranslation();
    const handleDrop = files => {
      if (files.length > 0) {
        setFile(files[0]);
        onChange(property.name, files[0]);
      }
    };
    const error = record.errors?.[property.path];
    return /*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
      error: Boolean(error)
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      flex: true,
      style: {
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React__default.default.createElement(adminjs.PropertyLabel, {
      property: property
    })), /*#__PURE__*/React__default.default.createElement(designSystem.DropZone, {
      onChange: handleDrop
    }), schemeVersion && schemeSize && (/*#__PURE__*/React__default.default.createElement(designSystem.DropZoneItem, {
      filename: `Version: <${schemeVersion}>, Size: ${schemeSize} MB`,
      src: 'test'
    })), /*#__PURE__*/React__default.default.createElement(designSystem.FormMessage, null, error && tm(error.message, property.resourceId)));
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
    }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      style: {
        opacity: record.params.id ? 0.5 : 1
      }
    }, /*#__PURE__*/React__default.default.createElement(designSystem.Select, {
      value: selected,
      options: availableValues,
      onChange: s => onChange(property.path, s?.value ?? ''),
      isDisabled: record.params.id ? true : false,
      ...property.props
    }), ' '), /*#__PURE__*/React__default.default.createElement(designSystem.FormMessage, null, error && tm(error.message, property.resourceId)));
  };

  const Cell = styledComponents.styled(designSystem.TableCell) `
  width: 100%;
  word-break: break-word;
`;
  const Row = styledComponents.styled(designSystem.TableRow) `
  display: flex;
  position: unset;
`;
  const Head = styledComponents.styled(designSystem.TableHead) `
  display: flex;
  position: unset;
`;
  const Table = styledComponents.styled(designSystem.Table) `
  width: 100%;
  position: unset;
  display: block;
`;
  const RecordDifference = ({ record, property }) => {
      const differences = JSON.parse(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      adminjs.flat.unflatten(record?.params ?? {})?.[property.name] ?? {});
      if (!differences) {
          return null;
      }
      return (React__default.default.createElement(designSystem.FormGroup, null,
          React__default.default.createElement(designSystem.Label, null, property.label),
          React__default.default.createElement(Table, null,
              React__default.default.createElement(Head, null,
                  React__default.default.createElement(Row, null,
                      React__default.default.createElement(Cell, null, "Property name"),
                      React__default.default.createElement(Cell, null, "Before"),
                      React__default.default.createElement(Cell, null, "After"))),
              React__default.default.createElement(designSystem.TableBody, null, Object.entries(differences).map(([propertyName, { before, after }]) => {
                  return (React__default.default.createElement(Row, { key: propertyName },
                      React__default.default.createElement(Cell, { width: 1 / 3 }, propertyName),
                      React__default.default.createElement(Cell, { color: "red", width: 1 / 3 }, JSON.stringify(before) || 'undefined'),
                      React__default.default.createElement(Cell, { color: "green", width: 1 / 3 }, JSON.stringify(after) || 'undefined')));
              })))));
  };

  const getLogPropertyName = (property, mapping = {}) => {
      if (!mapping[property]) {
          return property;
      }
      return mapping[property];
  };

  const viewHelpers = new adminjs.ViewHelpers();
  const RecordLink = ({ record, property }) => {
      if (!record?.params) {
          return null;
      }
      const { custom = {} } = property;
      const { propertiesMapping = {} } = custom;
      const recordIdParam = getLogPropertyName('recordId', propertiesMapping);
      const resourceIdParam = getLogPropertyName('resource', propertiesMapping);
      const recordTitleParam = getLogPropertyName('recordTitle', propertiesMapping);
      const recordId = record.params[recordIdParam];
      const resource = record.params[resourceIdParam];
      const recordTitle = record.params[recordTitleParam];
      if (!recordId || !resource) {
          return null;
      }
      return (React__default.default.createElement(designSystem.FormGroup, null,
          React__default.default.createElement(designSystem.Link, { href: viewHelpers.recordActionUrl({
                  actionName: 'show',
                  recordId,
                  resourceId: resource,
              }) }, recordTitle)));
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
  AdminJS.UserComponents.LoggedIn = LoggedIn;
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.SchemeUpload = SchemeUpload;
  AdminJS.UserComponents.SchemeTypeSelectEdit = SchemeTypeSelectEdit;
  AdminJS.UserComponents.RecordDifference = RecordDifference;
  AdminJS.UserComponents.RecordLink = RecordLink;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;

})(React, ReactRedux, AdminJSDesignSystem, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9nZ2VkSW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVVwbG9hZC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL2NvbXBvbmVudHMvUmVjb3JkRGlmZmVyZW5jZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL3V0aWxzL2dldC1sb2ctcHJvcGVydHktbmFtZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL2NvbXBvbmVudHMvUmVjb3JkTGluay5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvZmlsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQuanMiLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBCb3gsIEg1LCBIMiwgTGFiZWwsIElsbHVzdHJhdGlvbiwgSW5wdXQsIEZvcm1Hcm91cCwgQnV0dG9uLCBUZXh0LCBNZXNzYWdlQm94LCBNYWRlV2l0aExvdmUsIHRoZW1lR2V0LCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgV3JhcHBlciA9IHN0eWxlZChCb3gpIGBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwJTtcbmA7XG5jb25zdCBTdHlsZWRMb2dvID0gc3R5bGVkLmltZyBgXG4gIG1heC13aWR0aDogMjAwcHg7XG4gIG1hcmdpbjogJHt0aGVtZUdldCgnc3BhY2UnLCAnbWQnKX0gMDtcbmA7XG5jb25zdCBJbGx1c3RyYXRpb25zV3JhcHBlciA9IHN0eWxlZChCb3gpIGBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgJiBzdmcgW3N0cm9rZT0nIzNCMzU1MiddIHtcbiAgICBzdHJva2U6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcbiAgfVxuICAmIHN2ZyBbZmlsbD0nIzMwNDBENiddIHtcbiAgICBmaWxsOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDEpO1xuICB9XG5gO1xuZXhwb3J0IGNvbnN0IExvZ2luID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb3BzID0gd2luZG93Ll9fQVBQX1NUQVRFX187XG4gICAgY29uc3QgeyBhY3Rpb24sIGVycm9yTWVzc2FnZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVDb21wb25lbnQsIHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgYnJhbmRpbmcgPSB1c2VTZWxlY3Rvcigoc3RhdGUpID0+IHN0YXRlLmJyYW5kaW5nKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV3JhcHBlciwgeyBmbGV4OiB0cnVlLCB2YXJpYW50OiBcImdyZXlcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwid2hpdGVcIiwgaGVpZ2h0OiBcIjQ4MHB4XCIsIGZsZXg6IHRydWUsIGJveFNoYWRvdzogXCJsb2dpblwiLCB3aWR0aDogWzEsIDIgLyAzLCAnYXV0byddIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwicHJpbWFyeTEwMFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBwOiBcIngzXCIsIHdpZHRoOiBcIjM4MHB4XCIsIGZsZXhHcm93OiAwLCBkaXNwbGF5OiBbJ25vbmUnLCAnbm9uZScsICdibG9jayddLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDIsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiLCBtdDogXCJkZWZhdWx0XCIgfSwgXCJXZWxjb21lIHRvIHRoZSBHRU5UUkFJTiBhZG1pbiBwYW5lbC5cIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWxsdXN0cmF0aW9uc1dyYXBwZXIsIHsgcDogXCJ4eGxcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgbXI6IFwiZGVmYXVsdFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJQbGFuZXRcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkFzdHJvbmF1dFwiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgdG9wOiBcIi0yMHB4XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkZsYWdJbkNvZ1wiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYXM6IFwiZm9ybVwiLCBhY3Rpb246IGFjdGlvbiwgbWV0aG9kOiBcIlBPU1RcIiwgcDogXCJ4M1wiLCBmbGV4R3JvdzogMSwgd2lkdGg6IFsnMTAwJScsICcxMDAlJywgJzQ4MHB4J10gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChINSwgeyBtYXJnaW5Cb3R0b206IFwieHhsXCIgfSwgYnJhbmRpbmcubG9nbyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3R5bGVkTG9nbywgeyBzcmM6IGJyYW5kaW5nLmxvZ28sIGFsdDogYnJhbmRpbmcuY29tcGFueU5hbWUgfSkgOiBicmFuZGluZy5jb21wYW55TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChNZXNzYWdlQm94LCB7IG15OiBcImxnXCIsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiAnV3JvbmcgdXNlcm5hbWUgYW5kL29yIHBhc3N3b3JkJywgdmFyaWFudDogXCJkYW5nZXJcIiB9KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgeyByZXF1aXJlZDogdHJ1ZSB9LCBcIlVzZXJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyBuYW1lOiBcImVtYWlsXCIsIHBsYWNlaG9sZGVyOiBcIlVzZXJuYW1lXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgcmVxdWlyZWQ6IHRydWUgfSwgdHJhbnNsYXRlQ29tcG9uZW50KCdMb2dpbi5wcm9wZXJ0aWVzLnBhc3N3b3JkJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyB0eXBlOiBcInBhc3N3b3JkXCIsIG5hbWU6IFwicGFzc3dvcmRcIiwgcGxhY2Vob2xkZXI6IHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ucHJvcGVydGllcy5wYXNzd29yZCcpLCBhdXRvQ29tcGxldGU6IFwibmV3LXBhc3N3b3JkXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRleHQsIHsgbXQ6IFwieGxcIiwgdGV4dEFsaWduOiBcImNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB2YXJpYW50OiBcImNvbnRhaW5lZFwiIH0sIHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ubG9naW5CdXR0b24nKSkpKSksXG4gICAgICAgICAgICBicmFuZGluZy53aXRoTWFkZVdpdGhMb3ZlID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IG10OiBcInh4bFwiIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWRlV2l0aExvdmUsIG51bGwpKSkgOiBudWxsKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IExvZ2luO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEN1cnJlbnRVc2VyTmF2LCBCb3ggfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5jb25zdCBMb2dnZWRJbiA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgc2Vzc2lvbiwgcGF0aHMgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlQnV0dG9uIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IGRyb3BBY3Rpb25zID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0VkaXQgcHJvZmlsZScsXG4gICAgICAgICAgICBvbkNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYC9hZG1pbi9yZXNvdXJjZXMvdXNlci9yZWNvcmRzLyR7c2Vzc2lvbi5pZH0vZWRpdGA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaWNvbjogJ1VzZXInLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogdHJhbnNsYXRlQnV0dG9uKCdsb2dvdXQnKSxcbiAgICAgICAgICAgIG9uQ2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBwYXRocy5sb2dvdXRQYXRoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICdMb2dPdXQnLFxuICAgICAgICB9LFxuICAgIF07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBmbGV4U2hyaW5rOiAwLCBcImRhdGEtY3NzXCI6IFwibG9nZ2VkLWluXCIgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDdXJyZW50VXNlck5hdiwgeyBuYW1lOiBzZXNzaW9uLmVtYWlsLCB0aXRsZTogc2Vzc2lvbi50aXRsZSwgYXZhdGFyVXJsOiBzZXNzaW9uLmF2YXRhclVybCwgZHJvcEFjdGlvbnM6IGRyb3BBY3Rpb25zIH0pKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgTG9nZ2VkSW47XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBIMSwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuY29uc3QgRGFzaGJvYXJkID0gKCkgPT4ge1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgdmFyaWFudDogXCJncmV5XCIgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgdmFyaWFudDogXCJ3aGl0ZVwiLCBwOiBcInhsXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIMSwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiB9LCBcIkdFTlRSQUlOIEFkbWluXCIpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiLCBtdDogXCJkZWZhdWx0XCIgfSwgXCJXZWxjb21lIHRvIHRoZSBHRU5UUkFJTiBhZG1pbiBwYW5lbC4gSGVyZSB5b3UgY2FuIG1hbmFnZSB0aGUgcGF0aG9nZW4gZGF0YWJhc2UsIGNyZWF0ZSB1c2VycyBmb3IgdGhlIGFkbWluIHBhbmVsIGFuZCBhc3NpZ24gdXNlciByb2xlcy4gVXNlIHRoZSBuYXZpZ2F0aW9uIG9uIHRoZSBsZWZ0IHNpZGViYXIgdG8gYWNjZXNzIGRpZmZlcmVudCBzZWN0aW9ucy5cIikpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRGFzaGJvYXJkO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBEcm9wWm9uZSwgRHJvcFpvbmVJdGVtLCBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBQcm9wZXJ0eUxhYmVsLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgU2NoZW1lVXBsb2FkID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBvbkNoYW5nZSwgcHJvcGVydHksIHJlY29yZCB9ID0gcHJvcHM7XG4gICAgY29uc3QgW18sIHNldEZpbGVdID0gdXNlU3RhdGUobnVsbCk7XG4gICAgY29uc3Qgc2NoZW1lU2l6ZSA9IHJlY29yZC5wYXJhbXMuc2NoZW1lX3NpemU7XG4gICAgY29uc3Qgc2NoZW1lVmVyc2lvbiA9IG5ldyBEYXRlKHJlY29yZC5wYXJhbXMuc2NoZW1lX3ZlcnNpb24pLnRvTG9jYWxlU3RyaW5nKCdkZS1ERScsIHtcbiAgICAgICAgZGF0ZVN0eWxlOiAnc2hvcnQnLFxuICAgICAgICB0aW1lU3R5bGU6ICdzaG9ydCcsXG4gICAgfSk7XG4gICAgY29uc3QgeyB0bSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCBoYW5kbGVEcm9wID0gKGZpbGVzKSA9PiB7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzZXRGaWxlKGZpbGVzWzBdKTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKHByb3BlcnR5Lm5hbWUsIGZpbGVzWzBdKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBlcnJvcjogQm9vbGVhbihlcnJvcikgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZmxleDogdHJ1ZSwgc3R5bGU6IHsganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyB9IH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3BlcnR5TGFiZWwsIHsgcHJvcGVydHk6IHByb3BlcnR5IH0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZSwgeyBvbkNoYW5nZTogaGFuZGxlRHJvcCB9KSxcbiAgICAgICAgc2NoZW1lVmVyc2lvbiAmJiBzY2hlbWVTaXplICYmIChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBmaWxlbmFtZTogYFZlcnNpb246IDwke3NjaGVtZVZlcnNpb259PiwgU2l6ZTogJHtzY2hlbWVTaXplfSBNQmAsIHNyYzogJ3Rlc3QnIH0pKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtTWVzc2FnZSwgbnVsbCwgZXJyb3IgJiYgdG0oZXJyb3IubWVzc2FnZSwgcHJvcGVydHkucmVzb3VyY2VJZCkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2NoZW1lVXBsb2FkO1xuIiwiaW1wb3J0IHsgUHJvcGVydHlMYWJlbCwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UsIFNlbGVjdCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuY29uc3QgU2NoZW1lVHlwZVNlbGVjdEVkaXQgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHJlY29yZCwgcHJvcGVydHksIG9uQ2hhbmdlIH0gPSBwcm9wcztcbiAgICBjb25zdCBlcnJvciA9IHJlY29yZC5lcnJvcnM/Lltwcm9wZXJ0eS5wYXRoXTtcbiAgICBjb25zdCB7IHRtIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGlmICghcHJvcGVydHkuYXZhaWxhYmxlVmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBwcm9wVmFsdWUgPSByZWNvcmQucGFyYW1zPy5bcHJvcGVydHkucGF0aF0gPz8gcHJvcGVydHkucHJvcHMudmFsdWUgPz8gJyc7XG4gICAgY29uc3QgYXZhaWxhYmxlVmFsdWVzID0gcHJvcGVydHkuYXZhaWxhYmxlVmFsdWVzLm1hcCgodikgPT4gKHtcbiAgICAgICAgLi4udixcbiAgICAgICAgbGFiZWw6IHRtKGAke3Byb3BlcnR5LnBhdGh9LiR7di52YWx1ZX1gLCBwcm9wZXJ0eS5yZXNvdXJjZUlkLCB7IGRlZmF1bHRWYWx1ZTogdi5sYWJlbCA/PyB2LnZhbHVlIH0pLFxuICAgIH0pKTtcbiAgICBjb25zdCBzZWxlY3RlZCA9IGF2YWlsYWJsZVZhbHVlcy5maW5kKChhdikgPT4gYXYudmFsdWUgPT0gcHJvcFZhbHVlKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGVycm9yOiBCb29sZWFuKGVycm9yKSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFByb3BlcnR5TGFiZWwsIHsgcHJvcGVydHk6IHByb3BlcnR5IH0pLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBzdHlsZTogeyBvcGFjaXR5OiByZWNvcmQucGFyYW1zLmlkID8gMC41IDogMSB9IH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlbGVjdCwgeyB2YWx1ZTogc2VsZWN0ZWQsIG9wdGlvbnM6IGF2YWlsYWJsZVZhbHVlcywgb25DaGFuZ2U6IChzKSA9PiBvbkNoYW5nZShwcm9wZXJ0eS5wYXRoLCBzPy52YWx1ZSA/PyAnJyksIGlzRGlzYWJsZWQ6IHJlY29yZC5wYXJhbXMuaWQgPyB0cnVlIDogZmFsc2UsIC4uLnByb3BlcnR5LnByb3BzIH0pLFxuICAgICAgICAgICAgJyAnKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtTWVzc2FnZSwgbnVsbCwgZXJyb3IgJiYgdG0oZXJyb3IubWVzc2FnZSwgcHJvcGVydHkucmVzb3VyY2VJZCkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2NoZW1lVHlwZVNlbGVjdEVkaXQ7XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExhYmVsLCBUYWJsZSBhcyBBZG1pblRhYmxlLCBUYWJsZUJvZHksIFRhYmxlQ2VsbCwgVGFibGVIZWFkLCBUYWJsZVJvdywgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBzdHlsZWQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtL3N0eWxlZC1jb21wb25lbnRzJztcbmNvbnN0IENlbGwgPSBzdHlsZWQoVGFibGVDZWxsKSBgXG4gIHdpZHRoOiAxMDAlO1xuICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuYDtcbmNvbnN0IFJvdyA9IHN0eWxlZChUYWJsZVJvdykgYFxuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogdW5zZXQ7XG5gO1xuY29uc3QgSGVhZCA9IHN0eWxlZChUYWJsZUhlYWQpIGBcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHVuc2V0O1xuYDtcbmNvbnN0IFRhYmxlID0gc3R5bGVkKEFkbWluVGFibGUpIGBcbiAgd2lkdGg6IDEwMCU7XG4gIHBvc2l0aW9uOiB1bnNldDtcbiAgZGlzcGxheTogYmxvY2s7XG5gO1xuY29uc3QgUmVjb3JkRGlmZmVyZW5jZSA9ICh7IHJlY29yZCwgcHJvcGVydHkgfSkgPT4ge1xuICAgIGNvbnN0IGRpZmZlcmVuY2VzID0gSlNPTi5wYXJzZShcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIGZsYXQudW5mbGF0dGVuKHJlY29yZD8ucGFyYW1zID8/IHt9KT8uW3Byb3BlcnR5Lm5hbWVdID8/IHt9KTtcbiAgICBpZiAoIWRpZmZlcmVuY2VzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCBwcm9wZXJ0eS5sYWJlbCksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFibGUsIG51bGwsXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhlYWQsIG51bGwsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgbnVsbCwgXCJQcm9wZXJ0eSBuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIG51bGwsIFwiQmVmb3JlXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIG51bGwsIFwiQWZ0ZXJcIikpKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGFibGVCb2R5LCBudWxsLCBPYmplY3QuZW50cmllcyhkaWZmZXJlbmNlcykubWFwKChbcHJvcGVydHlOYW1lLCB7IGJlZm9yZSwgYWZ0ZXIgfV0pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCB7IGtleTogcHJvcGVydHlOYW1lIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgeyB3aWR0aDogMSAvIDMgfSwgcHJvcGVydHlOYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCB7IGNvbG9yOiBcInJlZFwiLCB3aWR0aDogMSAvIDMgfSwgSlNPTi5zdHJpbmdpZnkoYmVmb3JlKSB8fCAndW5kZWZpbmVkJyksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgeyBjb2xvcjogXCJncmVlblwiLCB3aWR0aDogMSAvIDMgfSwgSlNPTi5zdHJpbmdpZnkoYWZ0ZXIpIHx8ICd1bmRlZmluZWQnKSkpO1xuICAgICAgICAgICAgfSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFJlY29yZERpZmZlcmVuY2U7XG4iLCJleHBvcnQgY29uc3QgZ2V0TG9nUHJvcGVydHlOYW1lID0gKHByb3BlcnR5LCBtYXBwaW5nID0ge30pID0+IHtcbiAgICBpZiAoIW1hcHBpbmdbcHJvcGVydHldKSB7XG4gICAgICAgIHJldHVybiBwcm9wZXJ0eTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcHBpbmdbcHJvcGVydHldO1xufTtcbiIsImltcG9ydCB7IEZvcm1Hcm91cCwgTGluayB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgVmlld0hlbHBlcnMgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBnZXRMb2dQcm9wZXJ0eU5hbWUgfSBmcm9tICcuLi91dGlscy9nZXQtbG9nLXByb3BlcnR5LW5hbWUuanMnO1xuY29uc3Qgdmlld0hlbHBlcnMgPSBuZXcgVmlld0hlbHBlcnMoKTtcbmNvbnN0IFJlY29yZExpbmsgPSAoeyByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBpZiAoIXJlY29yZD8ucGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7IGN1c3RvbSA9IHt9IH0gPSBwcm9wZXJ0eTtcbiAgICBjb25zdCB7IHByb3BlcnRpZXNNYXBwaW5nID0ge30gfSA9IGN1c3RvbTtcbiAgICBjb25zdCByZWNvcmRJZFBhcmFtID0gZ2V0TG9nUHJvcGVydHlOYW1lKCdyZWNvcmRJZCcsIHByb3BlcnRpZXNNYXBwaW5nKTtcbiAgICBjb25zdCByZXNvdXJjZUlkUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoJ3Jlc291cmNlJywgcHJvcGVydGllc01hcHBpbmcpO1xuICAgIGNvbnN0IHJlY29yZFRpdGxlUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoJ3JlY29yZFRpdGxlJywgcHJvcGVydGllc01hcHBpbmcpO1xuICAgIGNvbnN0IHJlY29yZElkID0gcmVjb3JkLnBhcmFtc1tyZWNvcmRJZFBhcmFtXTtcbiAgICBjb25zdCByZXNvdXJjZSA9IHJlY29yZC5wYXJhbXNbcmVzb3VyY2VJZFBhcmFtXTtcbiAgICBjb25zdCByZWNvcmRUaXRsZSA9IHJlY29yZC5wYXJhbXNbcmVjb3JkVGl0bGVQYXJhbV07XG4gICAgaWYgKCFyZWNvcmRJZCB8fCAhcmVzb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGluaywgeyBocmVmOiB2aWV3SGVscGVycy5yZWNvcmRBY3Rpb25Vcmwoe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdzaG93JyxcbiAgICAgICAgICAgICAgICByZWNvcmRJZCxcbiAgICAgICAgICAgICAgICByZXNvdXJjZUlkOiByZXNvdXJjZSxcbiAgICAgICAgICAgIH0pIH0sIHJlY29yZFRpdGxlKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFJlY29yZExpbms7XG4iLCJpbXBvcnQgeyBEcm9wWm9uZSwgRHJvcFpvbmVJdGVtLCBGb3JtR3JvdXAsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0LCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5jb25zdCBFZGl0ID0gKHsgcHJvcGVydHksIHJlY29yZCwgb25DaGFuZ2UgfSkgPT4ge1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlUHJvcGVydHkgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgeyBwYXJhbXMgfSA9IHJlY29yZDtcbiAgICBjb25zdCB7IGN1c3RvbSB9ID0gcHJvcGVydHk7XG4gICAgY29uc3QgcGF0aCA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHkpO1xuICAgIGNvbnN0IGtleSA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmtleVByb3BlcnR5KTtcbiAgICBjb25zdCBmaWxlID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20uZmlsZVByb3BlcnR5KTtcbiAgICBjb25zdCBbb3JpZ2luYWxLZXksIHNldE9yaWdpbmFsS2V5XSA9IHVzZVN0YXRlKGtleSk7XG4gICAgY29uc3QgW2ZpbGVzVG9VcGxvYWQsIHNldEZpbGVzVG9VcGxvYWRdID0gdXNlU3RhdGUoW10pO1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIC8vIGl0IG1lYW5zIG1lYW5zIHRoYXQgc29tZW9uZSBoaXQgc2F2ZSBhbmQgbmV3IGZpbGUgaGFzIGJlZW4gdXBsb2FkZWRcbiAgICAgICAgLy8gaW4gdGhpcyBjYXNlIGZsaWVzVG9VcGxvYWQgc2hvdWxkIGJlIGNsZWFyZWQuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucyB3aGVuIHVzZXIgdHVybnMgb2ZmIHJlZGlyZWN0IGFmdGVyIG5ldy9lZGl0XG4gICAgICAgIGlmICgodHlwZW9mIGtleSA9PT0gJ3N0cmluZycgJiYga2V5ICE9PSBvcmlnaW5hbEtleSlcbiAgICAgICAgICAgIHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyAmJiAhb3JpZ2luYWxLZXkpXG4gICAgICAgICAgICB8fCAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgJiYgQXJyYXkuaXNBcnJheShrZXkpICYmIGtleS5sZW5ndGggIT09IG9yaWdpbmFsS2V5Lmxlbmd0aCkpIHtcbiAgICAgICAgICAgIHNldE9yaWdpbmFsS2V5KGtleSk7XG4gICAgICAgICAgICBzZXRGaWxlc1RvVXBsb2FkKFtdKTtcbiAgICAgICAgfVxuICAgIH0sIFtrZXksIG9yaWdpbmFsS2V5XSk7XG4gICAgY29uc3Qgb25VcGxvYWQgPSAoZmlsZXMpID0+IHtcbiAgICAgICAgc2V0RmlsZXNUb1VwbG9hZChmaWxlcyk7XG4gICAgICAgIG9uQ2hhbmdlKGN1c3RvbS5maWxlUHJvcGVydHksIGZpbGVzKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZVJlbW92ZSA9ICgpID0+IHtcbiAgICAgICAgb25DaGFuZ2UoY3VzdG9tLmZpbGVQcm9wZXJ0eSwgbnVsbCk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVNdWx0aVJlbW92ZSA9IChzaW5nbGVLZXkpID0+IHtcbiAgICAgICAgY29uc3QgaW5kZXggPSAoZmxhdC5nZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmtleVByb3BlcnR5KSB8fCBbXSkuaW5kZXhPZihzaW5nbGVLZXkpO1xuICAgICAgICBjb25zdCBmaWxlc1RvRGVsZXRlID0gZmxhdC5nZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmZpbGVzVG9EZWxldGVQcm9wZXJ0eSkgfHwgW107XG4gICAgICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgbmV3UGF0aCA9IHBhdGgubWFwKChjdXJyZW50UGF0aCwgaSkgPT4gKGkgIT09IGluZGV4ID8gY3VycmVudFBhdGggOiBudWxsKSk7XG4gICAgICAgICAgICBsZXQgbmV3UGFyYW1zID0gZmxhdC5zZXQocmVjb3JkLnBhcmFtcywgY3VzdG9tLmZpbGVzVG9EZWxldGVQcm9wZXJ0eSwgWy4uLmZpbGVzVG9EZWxldGUsIGluZGV4XSk7XG4gICAgICAgICAgICBuZXdQYXJhbXMgPSBmbGF0LnNldChuZXdQYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5LCBuZXdQYXRoKTtcbiAgICAgICAgICAgIG9uQ2hhbmdlKHtcbiAgICAgICAgICAgICAgICAuLi5yZWNvcmQsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBuZXdQYXJhbXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGNhbm5vdCByZW1vdmUgZmlsZSB3aGVuIHRoZXJlIGFyZSBubyB1cGxvYWRlZCBmaWxlcyB5ZXQnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgdHJhbnNsYXRlUHJvcGVydHkocHJvcGVydHkubGFiZWwsIHByb3BlcnR5LnJlc291cmNlSWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZSwgeyBvbkNoYW5nZTogb25VcGxvYWQsIG11bHRpcGxlOiBjdXN0b20ubXVsdGlwbGUsIHZhbGlkYXRlOiB7XG4gICAgICAgICAgICAgICAgbWltZVR5cGVzOiBjdXN0b20ubWltZVR5cGVzLFxuICAgICAgICAgICAgICAgIG1heFNpemU6IGN1c3RvbS5tYXhTaXplLFxuICAgICAgICAgICAgfSwgZmlsZXM6IGZpbGVzVG9VcGxvYWQgfSksXG4gICAgICAgICFjdXN0b20ubXVsdGlwbGUgJiYga2V5ICYmIHBhdGggJiYgIWZpbGVzVG9VcGxvYWQubGVuZ3RoICYmIGZpbGUgIT09IG51bGwgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGZpbGVuYW1lOiBrZXksIHNyYzogcGF0aCwgb25SZW1vdmU6IGhhbmRsZVJlbW92ZSB9KSksXG4gICAgICAgIGN1c3RvbS5tdWx0aXBsZSAmJiBrZXkgJiYga2V5Lmxlbmd0aCAmJiBwYXRoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIGtleS5tYXAoKHNpbmdsZUtleSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIC8vIHdoZW4gd2UgcmVtb3ZlIGl0ZW1zIHdlIHNldCBvbmx5IHBhdGggaW5kZXggdG8gbnVsbHMuXG4gICAgICAgICAgICAvLyBrZXkgaXMgc3RpbGwgdGhlcmUuIFRoaXMgaXMgYmVjYXVzZVxuICAgICAgICAgICAgLy8gd2UgaGF2ZSB0byBtYWludGFpbiBhbGwgdGhlIGluZGV4ZXMuIFNvIGhlcmUgd2Ugc2ltcGx5IGZpbHRlciBvdXQgZWxlbWVudHMgd2hpY2hcbiAgICAgICAgICAgIC8vIHdlcmUgcmVtb3ZlZCBhbmQgZGlzcGxheSBvbmx5IHdoYXQgd2FzIGxlZnRcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gcGF0aFtpbmRleF07XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFBhdGggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsga2V5OiBzaW5nbGVLZXksIGZpbGVuYW1lOiBzaW5nbGVLZXksIHNyYzogcGF0aFtpbmRleF0sIG9uUmVtb3ZlOiAoKSA9PiBoYW5kbGVNdWx0aVJlbW92ZShzaW5nbGVLZXkpIH0pKSA6ICcnO1xuICAgICAgICB9KSkpIDogJycpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBFZGl0O1xuIiwiZXhwb3J0IGNvbnN0IEF1ZGlvTWltZVR5cGVzID0gW1xuICAgICdhdWRpby9hYWMnLFxuICAgICdhdWRpby9taWRpJyxcbiAgICAnYXVkaW8veC1taWRpJyxcbiAgICAnYXVkaW8vbXBlZycsXG4gICAgJ2F1ZGlvL29nZycsXG4gICAgJ2FwcGxpY2F0aW9uL29nZycsXG4gICAgJ2F1ZGlvL29wdXMnLFxuICAgICdhdWRpby93YXYnLFxuICAgICdhdWRpby93ZWJtJyxcbiAgICAnYXVkaW8vM2dwcDInLFxuXTtcbmV4cG9ydCBjb25zdCBWaWRlb01pbWVUeXBlcyA9IFtcbiAgICAndmlkZW8veC1tc3ZpZGVvJyxcbiAgICAndmlkZW8vbXBlZycsXG4gICAgJ3ZpZGVvL29nZycsXG4gICAgJ3ZpZGVvL21wMnQnLFxuICAgICd2aWRlby93ZWJtJyxcbiAgICAndmlkZW8vM2dwcCcsXG4gICAgJ3ZpZGVvLzNncHAyJyxcbl07XG5leHBvcnQgY29uc3QgSW1hZ2VNaW1lVHlwZXMgPSBbXG4gICAgJ2ltYWdlL2JtcCcsXG4gICAgJ2ltYWdlL2dpZicsXG4gICAgJ2ltYWdlL2pwZWcnLFxuICAgICdpbWFnZS9wbmcnLFxuICAgICdpbWFnZS9zdmcreG1sJyxcbiAgICAnaW1hZ2Uvdm5kLm1pY3Jvc29mdC5pY29uJyxcbiAgICAnaW1hZ2UvdGlmZicsXG4gICAgJ2ltYWdlL3dlYnAnLFxuXTtcbmV4cG9ydCBjb25zdCBDb21wcmVzc2VkTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi94LWJ6aXAnLFxuICAgICdhcHBsaWNhdGlvbi94LWJ6aXAyJyxcbiAgICAnYXBwbGljYXRpb24vZ3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL2phdmEtYXJjaGl2ZScsXG4gICAgJ2FwcGxpY2F0aW9uL3gtdGFyJyxcbiAgICAnYXBwbGljYXRpb24vemlwJyxcbiAgICAnYXBwbGljYXRpb24veC03ei1jb21wcmVzc2VkJyxcbl07XG5leHBvcnQgY29uc3QgRG9jdW1lbnRNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtYWJpd29yZCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtZnJlZWFyYycsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5hbWF6b24uZWJvb2snLFxuICAgICdhcHBsaWNhdGlvbi9tc3dvcmQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQud29yZHByb2Nlc3NpbmdtbC5kb2N1bWVudCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1mb250b2JqZWN0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5wcmVzZW50YXRpb24nLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnNwcmVhZHNoZWV0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC50ZXh0JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQucHJlc2VudGF0aW9ubWwucHJlc2VudGF0aW9uJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLnJhcicsXG4gICAgJ2FwcGxpY2F0aW9uL3J0ZicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5zcHJlYWRzaGVldG1sLnNoZWV0Jyxcbl07XG5leHBvcnQgY29uc3QgVGV4dE1pbWVUeXBlcyA9IFtcbiAgICAndGV4dC9jc3MnLFxuICAgICd0ZXh0L2NzdicsXG4gICAgJ3RleHQvaHRtbCcsXG4gICAgJ3RleHQvY2FsZW5kYXInLFxuICAgICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnYXBwbGljYXRpb24vbGQranNvbicsXG4gICAgJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgJ3RleHQvcGxhaW4nLFxuICAgICdhcHBsaWNhdGlvbi94aHRtbCt4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94bWwnLFxuICAgICd0ZXh0L3htbCcsXG5dO1xuZXhwb3J0IGNvbnN0IEJpbmFyeURvY3NNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL2VwdWIremlwJyxcbiAgICAnYXBwbGljYXRpb24vcGRmJyxcbl07XG5leHBvcnQgY29uc3QgRm9udE1pbWVUeXBlcyA9IFtcbiAgICAnZm9udC9vdGYnLFxuICAgICdmb250L3R0ZicsXG4gICAgJ2ZvbnQvd29mZicsXG4gICAgJ2ZvbnQvd29mZjInLFxuXTtcbmV4cG9ydCBjb25zdCBPdGhlck1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICAnYXBwbGljYXRpb24veC1jc2gnLFxuICAgICdhcHBsaWNhdGlvbi92bmQuYXBwbGUuaW5zdGFsbGVyK3htbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtaHR0cGQtcGhwJyxcbiAgICAnYXBwbGljYXRpb24veC1zaCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJyxcbiAgICAndm5kLnZpc2lvJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1vemlsbGEueHVsK3htbCcsXG5dO1xuZXhwb3J0IGNvbnN0IE1pbWVUeXBlcyA9IFtcbiAgICAuLi5BdWRpb01pbWVUeXBlcyxcbiAgICAuLi5WaWRlb01pbWVUeXBlcyxcbiAgICAuLi5JbWFnZU1pbWVUeXBlcyxcbiAgICAuLi5Db21wcmVzc2VkTWltZVR5cGVzLFxuICAgIC4uLkRvY3VtZW50TWltZVR5cGVzLFxuICAgIC4uLlRleHRNaW1lVHlwZXMsXG4gICAgLi4uQmluYXJ5RG9jc01pbWVUeXBlcyxcbiAgICAuLi5PdGhlck1pbWVUeXBlcyxcbiAgICAuLi5Gb250TWltZVR5cGVzLFxuICAgIC4uLk90aGVyTWltZVR5cGVzLFxuXTtcbiIsIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IEJveCwgQnV0dG9uLCBJY29uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0IH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQXVkaW9NaW1lVHlwZXMsIEltYWdlTWltZVR5cGVzIH0gZnJvbSAnLi4vdHlwZXMvbWltZS10eXBlcy50eXBlLmpzJztcbmNvbnN0IFNpbmdsZUZpbGUgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IG5hbWUsIHBhdGgsIG1pbWVUeXBlLCB3aWR0aCB9ID0gcHJvcHM7XG4gICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1pbWVUeXBlICYmIEltYWdlTWltZVR5cGVzLmluY2x1ZGVzKG1pbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBwYXRoLCBzdHlsZTogeyBtYXhIZWlnaHQ6IHdpZHRoLCBtYXhXaWR0aDogd2lkdGggfSwgYWx0OiBuYW1lIH0pKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWltZVR5cGUgJiYgQXVkaW9NaW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiLCB7IGNvbnRyb2xzOiB0cnVlLCBzcmM6IHBhdGggfSxcbiAgICAgICAgICAgICAgICBcIllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZVwiLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJjb2RlXCIsIG51bGwsIFwiYXVkaW9cIiksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInRyYWNrXCIsIHsga2luZDogXCJjYXB0aW9uc1wiIH0pKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgYXM6IFwiYVwiLCBocmVmOiBwYXRoLCBtbDogXCJkZWZhdWx0XCIsIHNpemU6IFwic21cIiwgcm91bmRlZDogdHJ1ZSwgdGFyZ2V0OiBcIl9ibGFua1wiIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEljb24sIHsgaWNvbjogXCJEb2N1bWVudERvd25sb2FkXCIsIGNvbG9yOiBcIndoaXRlXCIsIG1yOiBcImRlZmF1bHRcIiB9KSxcbiAgICAgICAgICAgIG5hbWUpKSk7XG59O1xuY29uc3QgRmlsZSA9ICh7IHdpZHRoLCByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBjb25zdCB7IGN1c3RvbSB9ID0gcHJvcGVydHk7XG4gICAgbGV0IHBhdGggPSBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHkpO1xuICAgIGlmICghcGF0aCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbmFtZSA9IGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20uZmlsZU5hbWVQcm9wZXJ0eSA/IGN1c3RvbS5maWxlTmFtZVByb3BlcnR5IDogY3VzdG9tLmtleVByb3BlcnR5KTtcbiAgICBjb25zdCBtaW1lVHlwZSA9IGN1c3RvbS5taW1lVHlwZVByb3BlcnR5XG4gICAgICAgICYmIGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20ubWltZVR5cGVQcm9wZXJ0eSk7XG4gICAgaWYgKCFwcm9wZXJ0eS5jdXN0b20ubXVsdGlwbGUpIHtcbiAgICAgICAgaWYgKGN1c3RvbS5vcHRzICYmIGN1c3RvbS5vcHRzLmJhc2VVcmwpIHtcbiAgICAgICAgICAgIHBhdGggPSBgJHtjdXN0b20ub3B0cy5iYXNlVXJsfS8ke25hbWV9YDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRmlsZSwgeyBwYXRoOiBwYXRoLCBuYW1lOiBuYW1lLCB3aWR0aDogd2lkdGgsIG1pbWVUeXBlOiBtaW1lVHlwZSB9KSk7XG4gICAgfVxuICAgIGlmIChjdXN0b20ub3B0cyAmJiBjdXN0b20ub3B0cy5iYXNlVXJsKSB7XG4gICAgICAgIGNvbnN0IGJhc2VVcmwgPSBjdXN0b20ub3B0cy5iYXNlVXJsIHx8ICcnO1xuICAgICAgICBwYXRoID0gcGF0aC5tYXAoKHNpbmdsZVBhdGgsIGluZGV4KSA9PiBgJHtiYXNlVXJsfS8ke25hbWVbaW5kZXhdfWApO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIHBhdGgubWFwKChzaW5nbGVQYXRoLCBpbmRleCkgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2luZ2xlRmlsZSwgeyBrZXk6IHNpbmdsZVBhdGgsIHBhdGg6IHNpbmdsZVBhdGgsIG5hbWU6IG5hbWVbaW5kZXhdLCB3aWR0aDogd2lkdGgsIG1pbWVUeXBlOiBtaW1lVHlwZVtpbmRleF0gfSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEZpbGU7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJztcbmNvbnN0IExpc3QgPSAocHJvcHMpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGUsIHsgd2lkdGg6IDEwMCwgLi4ucHJvcHMgfSkpO1xuZXhwb3J0IGRlZmF1bHQgTGlzdDtcbiIsImltcG9ydCB7IEZvcm1Hcm91cCwgTGFiZWwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IEZpbGUgZnJvbSAnLi9maWxlLmpzJztcbmNvbnN0IFNob3cgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHByb3BlcnR5IH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zbGF0ZVByb3BlcnR5IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHRyYW5zbGF0ZVByb3BlcnR5KHByb3BlcnR5LmxhYmVsLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZSwgeyB3aWR0aDogXCIxMDAlXCIsIC4uLnByb3BzIH0pKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgU2hvdztcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IExvZ2luIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9Mb2dpbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9naW4gPSBMb2dpblxuaW1wb3J0IExvZ2dlZEluIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9Mb2dnZWRJbidcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuTG9nZ2VkSW4gPSBMb2dnZWRJblxuaW1wb3J0IERhc2hib2FyZCBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EYXNoYm9hcmQgPSBEYXNoYm9hcmRcbmltcG9ydCBTY2hlbWVVcGxvYWQgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVVwbG9hZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2NoZW1lVXBsb2FkID0gU2NoZW1lVXBsb2FkXG5pbXBvcnQgU2NoZW1lVHlwZVNlbGVjdEVkaXQgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVR5cGVTZWxlY3RFZGl0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TY2hlbWVUeXBlU2VsZWN0RWRpdCA9IFNjaGVtZVR5cGVTZWxlY3RFZGl0XG5pbXBvcnQgUmVjb3JkRGlmZmVyZW5jZSBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZERpZmZlcmVuY2UnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZERpZmZlcmVuY2UgPSBSZWNvcmREaWZmZXJlbmNlXG5pbXBvcnQgUmVjb3JkTGluayBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZExpbmsnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZExpbmsgPSBSZWNvcmRMaW5rXG5pbXBvcnQgVXBsb2FkRWRpdENvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkRWRpdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkRWRpdENvbXBvbmVudCA9IFVwbG9hZEVkaXRDb21wb25lbnRcbmltcG9ydCBVcGxvYWRMaXN0Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRMaXN0Q29tcG9uZW50ID0gVXBsb2FkTGlzdENvbXBvbmVudFxuaW1wb3J0IFVwbG9hZFNob3dDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZFNob3dDb21wb25lbnQgPSBVcGxvYWRTaG93Q29tcG9uZW50Il0sIm5hbWVzIjpbIldyYXBwZXIiLCJzdHlsZWQiLCJCb3giLCJTdHlsZWRMb2dvIiwiaW1nIiwidGhlbWVHZXQiLCJJbGx1c3RyYXRpb25zV3JhcHBlciIsIkxvZ2luIiwicHJvcHMiLCJ3aW5kb3ciLCJfX0FQUF9TVEFURV9fIiwiYWN0aW9uIiwiZXJyb3JNZXNzYWdlIiwidHJhbnNsYXRlQ29tcG9uZW50IiwidHJhbnNsYXRlTWVzc2FnZSIsInVzZVRyYW5zbGF0aW9uIiwiYnJhbmRpbmciLCJ1c2VTZWxlY3RvciIsInN0YXRlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJmbGV4IiwidmFyaWFudCIsImJnIiwiaGVpZ2h0IiwiYm94U2hhZG93Iiwid2lkdGgiLCJjb2xvciIsInAiLCJmbGV4R3JvdyIsImRpc3BsYXkiLCJwb3NpdGlvbiIsIkgyIiwiZm9udFdlaWdodCIsIlRleHQiLCJtdCIsIm1yIiwiSWxsdXN0cmF0aW9uIiwidG9wIiwiYXMiLCJtZXRob2QiLCJINSIsIm1hcmdpbkJvdHRvbSIsImxvZ28iLCJzcmMiLCJhbHQiLCJjb21wYW55TmFtZSIsIk1lc3NhZ2VCb3giLCJteSIsIm1lc3NhZ2UiLCJzcGxpdCIsImxlbmd0aCIsIkZvcm1Hcm91cCIsIkxhYmVsIiwicmVxdWlyZWQiLCJJbnB1dCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJhdXRvQ29tcGxldGUiLCJ0ZXh0QWxpZ24iLCJCdXR0b24iLCJ3aXRoTWFkZVdpdGhMb3ZlIiwiTWFkZVdpdGhMb3ZlIiwiTG9nZ2VkSW4iLCJzZXNzaW9uIiwicGF0aHMiLCJ0cmFuc2xhdGVCdXR0b24iLCJkcm9wQWN0aW9ucyIsImxhYmVsIiwib25DbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJsb2NhdGlvbiIsImhyZWYiLCJpZCIsImljb24iLCJsb2dvdXRQYXRoIiwiZmxleFNocmluayIsIkN1cnJlbnRVc2VyTmF2IiwiZW1haWwiLCJ0aXRsZSIsImF2YXRhclVybCIsIkRhc2hib2FyZCIsIkgxIiwiU2NoZW1lVXBsb2FkIiwib25DaGFuZ2UiLCJwcm9wZXJ0eSIsInJlY29yZCIsIl8iLCJzZXRGaWxlIiwidXNlU3RhdGUiLCJzY2hlbWVTaXplIiwicGFyYW1zIiwic2NoZW1lX3NpemUiLCJzY2hlbWVWZXJzaW9uIiwiRGF0ZSIsInNjaGVtZV92ZXJzaW9uIiwidG9Mb2NhbGVTdHJpbmciLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJ0bSIsImhhbmRsZURyb3AiLCJmaWxlcyIsImVycm9yIiwiZXJyb3JzIiwicGF0aCIsIkJvb2xlYW4iLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiUHJvcGVydHlMYWJlbCIsIkRyb3Bab25lIiwiRHJvcFpvbmVJdGVtIiwiZmlsZW5hbWUiLCJGb3JtTWVzc2FnZSIsInJlc291cmNlSWQiLCJTY2hlbWVUeXBlU2VsZWN0RWRpdCIsImF2YWlsYWJsZVZhbHVlcyIsInByb3BWYWx1ZSIsInZhbHVlIiwibWFwIiwidiIsImRlZmF1bHRWYWx1ZSIsInNlbGVjdGVkIiwiZmluZCIsImF2Iiwib3BhY2l0eSIsIlNlbGVjdCIsIm9wdGlvbnMiLCJzIiwiaXNEaXNhYmxlZCIsIlRhYmxlQ2VsbCIsIlRhYmxlUm93IiwiVGFibGVIZWFkIiwiQWRtaW5UYWJsZSIsImZsYXQiLCJUYWJsZUJvZHkiLCJWaWV3SGVscGVycyIsIkxpbmsiLCJ1c2VFZmZlY3QiLCJJY29uIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiUmVjb3JkRGlmZmVyZW5jZSIsIlJlY29yZExpbmsiLCJVcGxvYWRFZGl0Q29tcG9uZW50IiwiVXBsb2FkTGlzdENvbXBvbmVudCIsIlVwbG9hZFNob3dDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFLQSxNQUFNQSxPQUFPLEdBQUdDLHVCQUFNLENBQUNDLGdCQUFHLENBQUU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFD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UUFBUSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVOLENBQUM7O0VDekNELE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxNQUFNQSxzQkFBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLENBQUMsQ0FBQzs7RUNFN0UsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUs7RUFDeEIsSUFBSSxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSztFQUM5QixJQUFJLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxHQUFHSixzQkFBYyxFQUFFO0VBQ2xELElBQUksUUFBUUksc0JBQUssQ0FBQyxhQUFhLENBQUNrQyxzQkFBUyxFQUFFLElBQUk7RUFDL0MsUUFBUWxDLHNCQUFLLENBQUMsYUFBYSxDQUFDbUMsa0JBQUssRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDaEcsUUFBUW5DLHNCQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQy9ELENBQUM7O0VDVkQySCxPQUFPLENBQUNDLGNBQWMsR0FBRyxFQUFFO0VBRTNCRCxPQUFPLENBQUNDLGNBQWMsQ0FBQ3hJLEtBQUssR0FBR0EsS0FBSztFQUVwQ3VJLE9BQU8sQ0FBQ0MsY0FBYyxDQUFDOUUsUUFBUSxHQUFHQSxRQUFRO0VBRTFDNkUsT0FBTyxDQUFDQyxjQUFjLENBQUMzRCxTQUFTLEdBQUdBLFNBQVM7RUFFNUMwRCxPQUFPLENBQUNDLGNBQWMsQ0FBQ3pELFlBQVksR0FBR0EsWUFBWTtFQUVsRHdELE9BQU8sQ0FBQ0MsY0FBYyxDQUFDMUIsb0JBQW9CLEdBQUdBLG9CQUFvQjtFQUVsRXlCLE9BQU8sQ0FBQ0MsY0FBYyxDQUFDQyxnQkFBZ0IsR0FBR0EsZ0JBQWdCO0VBRTFERixPQUFPLENBQUNDLGNBQWMsQ0FBQ0UsVUFBVSxHQUFHQSxVQUFVO0VBRTlDSCxPQUFPLENBQUNDLGNBQWMsQ0FBQ0csbUJBQW1CLEdBQUdBLElBQW1CO0VBRWhFSixPQUFPLENBQUNDLGNBQWMsQ0FBQ0ksbUJBQW1CLEdBQUdBLElBQW1CO0VBRWhFTCxPQUFPLENBQUNDLGNBQWMsQ0FBQ0ssbUJBQW1CLEdBQUdBLElBQW1COzs7Ozs7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzUsNiw3LDgsOSwxMCwxMSwxMl19
