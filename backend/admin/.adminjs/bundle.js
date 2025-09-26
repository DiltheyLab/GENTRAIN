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
      label: 'Change password',
      onClick: event => {
        event.preventDefault();
        window.location.href = `/admin/resources/password/records/${session.id}/edit`;
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

  const ErrorMessage = props => {
    const {
      property,
      record
    } = props;
    const {
      tm
    } = adminjs.useTranslation();
    const error = record.errors?.[property.path];
    return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, error && (/*#__PURE__*/React__default.default.createElement(designSystem.FormGroup, {
      error: Boolean(error)
    }, /*#__PURE__*/React__default.default.createElement(designSystem.FormMessage, null, tm(error.message, property.resourceId)))));
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
  AdminJS.UserComponents.ErrorMessage = ErrorMessage;
  AdminJS.UserComponents.RecordDifference = RecordDifference;
  AdminJS.UserComponents.RecordLink = RecordLink;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;

})(React, ReactRedux, AdminJSDesignSystem, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9nZ2VkSW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVVwbG9hZC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9FcnJvck1lc3NhZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZERpZmZlcmVuY2UuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi91dGlscy9nZXQtbG9nLXByb3BlcnR5LW5hbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZExpbmsuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkRWRpdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvdHlwZXMvbWltZS10eXBlcy50eXBlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL2ZpbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50LmpzIiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVNlbGVjdG9yIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgQm94LCBINSwgSDIsIExhYmVsLCBJbGx1c3RyYXRpb24sIElucHV0LCBGb3JtR3JvdXAsIEJ1dHRvbiwgVGV4dCwgTWVzc2FnZUJveCwgTWFkZVdpdGhMb3ZlLCB0aGVtZUdldCwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQoQm94KSBgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG5gO1xuY29uc3QgU3R5bGVkTG9nbyA9IHN0eWxlZC5pbWcgYFxuICBtYXgtd2lkdGg6IDIwMHB4O1xuICBtYXJnaW46ICR7dGhlbWVHZXQoJ3NwYWNlJywgJ21kJyl9IDA7XG5gO1xuY29uc3QgSWxsdXN0cmF0aW9uc1dyYXBwZXIgPSBzdHlsZWQoQm94KSBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICYgc3ZnIFtzdHJva2U9JyMzQjM1NTInXSB7XG4gICAgc3Ryb2tlOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XG4gIH1cbiAgJiBzdmcgW2ZpbGw9JyMzMDQwRDYnXSB7XG4gICAgZmlsbDogcmdiYSgyNTUsIDI1NSwgMjU1LCAxKTtcbiAgfVxuYDtcbmV4cG9ydCBjb25zdCBMb2dpbiA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9wcyA9IHdpbmRvdy5fX0FQUF9TVEFURV9fO1xuICAgIGNvbnN0IHsgYWN0aW9uLCBlcnJvck1lc3NhZ2UgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlQ29tcG9uZW50LCB0cmFuc2xhdGVNZXNzYWdlIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IGJyYW5kaW5nID0gdXNlU2VsZWN0b3IoKHN0YXRlKSA9PiBzdGF0ZS5icmFuZGluZyk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdyYXBwZXIsIHsgZmxleDogdHJ1ZSwgdmFyaWFudDogXCJncmV5XCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGJnOiBcIndoaXRlXCIsIGhlaWdodDogXCI0ODBweFwiLCBmbGV4OiB0cnVlLCBib3hTaGFkb3c6IFwibG9naW5cIiwgd2lkdGg6IFsxLCAyIC8gMywgJ2F1dG8nXSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGJnOiBcInByaW1hcnkxMDBcIiwgY29sb3I6IFwid2hpdGVcIiwgcDogXCJ4M1wiLCB3aWR0aDogXCIzODBweFwiLCBmbGV4R3JvdzogMCwgZGlzcGxheTogWydub25lJywgJ25vbmUnLCAnYmxvY2snXSwgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEgyLCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiIH0sIFwiR0VOVFJBSU4gQWRtaW5cIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dCwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiwgbXQ6IFwiZGVmYXVsdFwiIH0sIFwiV2VsY29tZSB0byB0aGUgR0VOVFJBSU4gYWRtaW4gcGFuZWwuXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbnNXcmFwcGVyLCB7IHA6IFwieHhsXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIsIG1yOiBcImRlZmF1bHRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWxsdXN0cmF0aW9uLCB7IHZhcmlhbnQ6IFwiUGxhbmV0XCIsIHdpZHRoOiA4MiwgaGVpZ2h0OiA5MSB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBkaXNwbGF5OiBcImlubGluZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJBc3Ryb25hdXRcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIsIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHRvcDogXCItMjBweFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJGbGFnSW5Db2dcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGFzOiBcImZvcm1cIiwgYWN0aW9uOiBhY3Rpb24sIG1ldGhvZDogXCJQT1NUXCIsIHA6IFwieDNcIiwgZmxleEdyb3c6IDEsIHdpZHRoOiBbJzEwMCUnLCAnMTAwJScsICc0ODBweCddIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDUsIHsgbWFyZ2luQm90dG9tOiBcInh4bFwiIH0sIGJyYW5kaW5nLmxvZ28gPyBSZWFjdC5jcmVhdGVFbGVtZW50KFN0eWxlZExvZ28sIHsgc3JjOiBicmFuZGluZy5sb2dvLCBhbHQ6IGJyYW5kaW5nLmNvbXBhbnlOYW1lIH0pIDogYnJhbmRpbmcuY29tcGFueU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVzc2FnZUJveCwgeyBteTogXCJsZ1wiLCBtZXNzYWdlOiBlcnJvck1lc3NhZ2Uuc3BsaXQoJyAnKS5sZW5ndGggPiAxID8gZXJyb3JNZXNzYWdlIDogJ1dyb25nIHVzZXJuYW1lIGFuZC9vciBwYXNzd29yZCcsIHZhcmlhbnQ6IFwiZGFuZ2VyXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgcmVxdWlyZWQ6IHRydWUgfSwgXCJVc2VybmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHsgbmFtZTogXCJlbWFpbFwiLCBwbGFjZWhvbGRlcjogXCJVc2VybmFtZVwiIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCB7IHJlcXVpcmVkOiB0cnVlIH0sIHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ucHJvcGVydGllcy5wYXNzd29yZCcpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHsgdHlwZTogXCJwYXNzd29yZFwiLCBuYW1lOiBcInBhc3N3b3JkXCIsIHBsYWNlaG9sZGVyOiB0cmFuc2xhdGVDb21wb25lbnQoJ0xvZ2luLnByb3BlcnRpZXMucGFzc3dvcmQnKSwgYXV0b0NvbXBsZXRlOiBcIm5ldy1wYXNzd29yZFwiIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IG10OiBcInhsXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgdmFyaWFudDogXCJjb250YWluZWRcIiB9LCB0cmFuc2xhdGVDb21wb25lbnQoJ0xvZ2luLmxvZ2luQnV0dG9uJykpKSkpLFxuICAgICAgICAgICAgYnJhbmRpbmcud2l0aE1hZGVXaXRoTG92ZSA/IChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBtdDogXCJ4eGxcIiB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFkZVdpdGhMb3ZlLCBudWxsKSkpIDogbnVsbCkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBMb2dpbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDdXJyZW50VXNlck5hdiwgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgTG9nZ2VkSW4gPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHNlc3Npb24sIHBhdGhzIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zbGF0ZUJ1dHRvbiB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCBkcm9wQWN0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDaGFuZ2UgcGFzc3dvcmQnLFxuICAgICAgICAgICAgb25DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvYWRtaW4vcmVzb3VyY2VzL3Bhc3N3b3JkL3JlY29yZHMvJHtzZXNzaW9uLmlkfS9lZGl0YDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpY29uOiAnVXNlcicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiB0cmFuc2xhdGVCdXR0b24oJ2xvZ291dCcpLFxuICAgICAgICAgICAgb25DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHBhdGhzLmxvZ291dFBhdGg7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaWNvbjogJ0xvZ091dCcsXG4gICAgICAgIH0sXG4gICAgXTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXhTaHJpbms6IDAsIFwiZGF0YS1jc3NcIjogXCJsb2dnZWQtaW5cIiB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEN1cnJlbnRVc2VyTmF2LCB7IG5hbWU6IHNlc3Npb24uZW1haWwsIHRpdGxlOiBzZXNzaW9uLnRpdGxlLCBhdmF0YXJVcmw6IHNlc3Npb24uYXZhdGFyVXJsLCBkcm9wQWN0aW9uczogZHJvcEFjdGlvbnMgfSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBMb2dnZWRJbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIEgxLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5jb25zdCBEYXNoYm9hcmQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyB2YXJpYW50OiBcImdyZXlcIiB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyB2YXJpYW50OiBcIndoaXRlXCIsIHA6IFwieGxcIiwgdGV4dEFsaWduOiBcImNlbnRlclwiIH0sXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEgxLCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiIH0sIFwiR0VOVFJBSU4gQWRtaW5cIiksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRleHQsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIsIG10OiBcImRlZmF1bHRcIiB9LCBcIldlbGNvbWUgdG8gdGhlIEdFTlRSQUlOIGFkbWluIHBhbmVsLiBIZXJlIHlvdSBjYW4gbWFuYWdlIHRoZSBwYXRob2dlbiBkYXRhYmFzZSwgY3JlYXRlIHVzZXJzIGZvciB0aGUgYWRtaW4gcGFuZWwgYW5kIGFzc2lnbiB1c2VyIHJvbGVzLiBVc2UgdGhlIG5hdmlnYXRpb24gb24gdGhlIGxlZnQgc2lkZWJhciB0byBhY2Nlc3MgZGlmZmVyZW50IHNlY3Rpb25zLlwiKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBEYXNoYm9hcmQ7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCb3gsIERyb3Bab25lLCBEcm9wWm9uZUl0ZW0sIEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IFByb3BlcnR5TGFiZWwsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5jb25zdCBTY2hlbWVVcGxvYWQgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IG9uQ2hhbmdlLCBwcm9wZXJ0eSwgcmVjb3JkIH0gPSBwcm9wcztcbiAgICBjb25zdCBbXywgc2V0RmlsZV0gPSB1c2VTdGF0ZShudWxsKTtcbiAgICBjb25zdCBzY2hlbWVTaXplID0gcmVjb3JkLnBhcmFtcy5zY2hlbWVfc2l6ZTtcbiAgICBjb25zdCBzY2hlbWVWZXJzaW9uID0gbmV3IERhdGUocmVjb3JkLnBhcmFtcy5zY2hlbWVfdmVyc2lvbikudG9Mb2NhbGVTdHJpbmcoJ2RlLURFJywge1xuICAgICAgICBkYXRlU3R5bGU6ICdzaG9ydCcsXG4gICAgICAgIHRpbWVTdHlsZTogJ3Nob3J0JyxcbiAgICB9KTtcbiAgICBjb25zdCB7IHRtIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IGhhbmRsZURyb3AgPSAoZmlsZXMpID0+IHtcbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNldEZpbGUoZmlsZXNbMF0pO1xuICAgICAgICAgICAgb25DaGFuZ2UocHJvcGVydHkubmFtZSwgZmlsZXNbMF0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBlcnJvciA9IHJlY29yZC5lcnJvcnM/Lltwcm9wZXJ0eS5wYXRoXTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGVycm9yOiBCb29sZWFuKGVycm9yKSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBmbGV4OiB0cnVlLCBzdHlsZTogeyBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvcGVydHlMYWJlbCwgeyBwcm9wZXJ0eTogcHJvcGVydHkgfSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lLCB7IG9uQ2hhbmdlOiBoYW5kbGVEcm9wIH0pLFxuICAgICAgICBzY2hlbWVWZXJzaW9uICYmIHNjaGVtZVNpemUgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGZpbGVuYW1lOiBgVmVyc2lvbjogPCR7c2NoZW1lVmVyc2lvbn0+LCBTaXplOiAke3NjaGVtZVNpemV9IE1CYCwgc3JjOiAndGVzdCcgfSkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1NZXNzYWdlLCBudWxsLCBlcnJvciAmJiB0bShlcnJvci5tZXNzYWdlLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTY2hlbWVVcGxvYWQ7XG4iLCJpbXBvcnQgeyBQcm9wZXJ0eUxhYmVsLCB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgRm9ybUdyb3VwLCBGb3JtTWVzc2FnZSwgU2VsZWN0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5jb25zdCBTY2hlbWVUeXBlU2VsZWN0RWRpdCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcmVjb3JkLCBwcm9wZXJ0eSwgb25DaGFuZ2UgfSA9IHByb3BzO1xuICAgIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdO1xuICAgIGNvbnN0IHsgdG0gfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgaWYgKCFwcm9wZXJ0eS5hdmFpbGFibGVWYWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHByb3BWYWx1ZSA9IHJlY29yZC5wYXJhbXM/Lltwcm9wZXJ0eS5wYXRoXSA/PyBwcm9wZXJ0eS5wcm9wcy52YWx1ZSA/PyAnJztcbiAgICBjb25zdCBhdmFpbGFibGVWYWx1ZXMgPSBwcm9wZXJ0eS5hdmFpbGFibGVWYWx1ZXMubWFwKCh2KSA9PiAoe1xuICAgICAgICAuLi52LFxuICAgICAgICBsYWJlbDogdG0oYCR7cHJvcGVydHkucGF0aH0uJHt2LnZhbHVlfWAsIHByb3BlcnR5LnJlc291cmNlSWQsIHsgZGVmYXVsdFZhbHVlOiB2LmxhYmVsID8/IHYudmFsdWUgfSksXG4gICAgfSkpO1xuICAgIGNvbnN0IHNlbGVjdGVkID0gYXZhaWxhYmxlVmFsdWVzLmZpbmQoKGF2KSA9PiBhdi52YWx1ZSA9PSBwcm9wVmFsdWUpO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgZXJyb3I6IEJvb2xlYW4oZXJyb3IpIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUHJvcGVydHlMYWJlbCwgeyBwcm9wZXJ0eTogcHJvcGVydHkgfSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHN0eWxlOiB7IG9wYWNpdHk6IHJlY29yZC5wYXJhbXMuaWQgPyAwLjUgOiAxIH0gfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VsZWN0LCB7IHZhbHVlOiBzZWxlY3RlZCwgb3B0aW9uczogYXZhaWxhYmxlVmFsdWVzLCBvbkNoYW5nZTogKHMpID0+IG9uQ2hhbmdlKHByb3BlcnR5LnBhdGgsIHM/LnZhbHVlID8/ICcnKSwgaXNEaXNhYmxlZDogcmVjb3JkLnBhcmFtcy5pZCA/IHRydWUgOiBmYWxzZSwgLi4ucHJvcGVydHkucHJvcHMgfSksXG4gICAgICAgICAgICAnICcpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1NZXNzYWdlLCBudWxsLCBlcnJvciAmJiB0bShlcnJvci5tZXNzYWdlLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTY2hlbWVUeXBlU2VsZWN0RWRpdDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgRXJyb3JNZXNzYWdlID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBwcm9wZXJ0eSwgcmVjb3JkIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRtIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgZXJyb3IgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCB7IGVycm9yOiBCb29sZWFuKGVycm9yKSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1NZXNzYWdlLCBudWxsLCB0bShlcnJvci5tZXNzYWdlLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSkpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEVycm9yTWVzc2FnZTtcbiIsImltcG9ydCB7IEZvcm1Hcm91cCwgTGFiZWwsIFRhYmxlIGFzIEFkbWluVGFibGUsIFRhYmxlQm9keSwgVGFibGVDZWxsLCBUYWJsZUhlYWQsIFRhYmxlUm93LCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHMnO1xuY29uc3QgQ2VsbCA9IHN0eWxlZChUYWJsZUNlbGwpIGBcbiAgd2lkdGg6IDEwMCU7XG4gIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XG5gO1xuY29uc3QgUm93ID0gc3R5bGVkKFRhYmxlUm93KSBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiB1bnNldDtcbmA7XG5jb25zdCBIZWFkID0gc3R5bGVkKFRhYmxlSGVhZCkgYFxuICBkaXNwbGF5OiBmbGV4O1xuICBwb3NpdGlvbjogdW5zZXQ7XG5gO1xuY29uc3QgVGFibGUgPSBzdHlsZWQoQWRtaW5UYWJsZSkgYFxuICB3aWR0aDogMTAwJTtcbiAgcG9zaXRpb246IHVuc2V0O1xuICBkaXNwbGF5OiBibG9jaztcbmA7XG5jb25zdCBSZWNvcmREaWZmZXJlbmNlID0gKHsgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgY29uc3QgZGlmZmVyZW5jZXMgPSBKU09OLnBhcnNlKFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XG4gICAgZmxhdC51bmZsYXR0ZW4ocmVjb3JkPy5wYXJhbXMgPz8ge30pPy5bcHJvcGVydHkubmFtZV0gPz8ge30pO1xuICAgIGlmICghZGlmZmVyZW5jZXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHByb3BlcnR5LmxhYmVsKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJsZSwgbnVsbCxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSGVhZCwgbnVsbCxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCBudWxsLCBcIlByb3BlcnR5IG5hbWVcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgbnVsbCwgXCJCZWZvcmVcIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgbnVsbCwgXCJBZnRlclwiKSkpLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUYWJsZUJvZHksIG51bGwsIE9iamVjdC5lbnRyaWVzKGRpZmZlcmVuY2VzKS5tYXAoKFtwcm9wZXJ0eU5hbWUsIHsgYmVmb3JlLCBhZnRlciB9XSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSb3csIHsga2V5OiBwcm9wZXJ0eU5hbWUgfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCB7IHdpZHRoOiAxIC8gMyB9LCBwcm9wZXJ0eU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIHsgY29sb3I6IFwicmVkXCIsIHdpZHRoOiAxIC8gMyB9LCBKU09OLnN0cmluZ2lmeShiZWZvcmUpIHx8ICd1bmRlZmluZWQnKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCB7IGNvbG9yOiBcImdyZWVuXCIsIHdpZHRoOiAxIC8gMyB9LCBKU09OLnN0cmluZ2lmeShhZnRlcikgfHwgJ3VuZGVmaW5lZCcpKSk7XG4gICAgICAgICAgICB9KSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgUmVjb3JkRGlmZmVyZW5jZTtcbiIsImV4cG9ydCBjb25zdCBnZXRMb2dQcm9wZXJ0eU5hbWUgPSAocHJvcGVydHksIG1hcHBpbmcgPSB7fSkgPT4ge1xuICAgIGlmICghbWFwcGluZ1twcm9wZXJ0eV0pIHtcbiAgICAgICAgcmV0dXJuIHByb3BlcnR5O1xuICAgIH1cbiAgICByZXR1cm4gbWFwcGluZ1twcm9wZXJ0eV07XG59O1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMaW5rIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBWaWV3SGVscGVycyB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGdldExvZ1Byb3BlcnR5TmFtZSB9IGZyb20gJy4uL3V0aWxzL2dldC1sb2ctcHJvcGVydHktbmFtZS5qcyc7XG5jb25zdCB2aWV3SGVscGVycyA9IG5ldyBWaWV3SGVscGVycygpO1xuY29uc3QgUmVjb3JkTGluayA9ICh7IHJlY29yZCwgcHJvcGVydHkgfSkgPT4ge1xuICAgIGlmICghcmVjb3JkPy5wYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgY3VzdG9tID0ge30gfSA9IHByb3BlcnR5O1xuICAgIGNvbnN0IHsgcHJvcGVydGllc01hcHBpbmcgPSB7fSB9ID0gY3VzdG9tO1xuICAgIGNvbnN0IHJlY29yZElkUGFyYW0gPSBnZXRMb2dQcm9wZXJ0eU5hbWUoJ3JlY29yZElkJywgcHJvcGVydGllc01hcHBpbmcpO1xuICAgIGNvbnN0IHJlc291cmNlSWRQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZSgncmVzb3VyY2UnLCBwcm9wZXJ0aWVzTWFwcGluZyk7XG4gICAgY29uc3QgcmVjb3JkVGl0bGVQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZSgncmVjb3JkVGl0bGUnLCBwcm9wZXJ0aWVzTWFwcGluZyk7XG4gICAgY29uc3QgcmVjb3JkSWQgPSByZWNvcmQucGFyYW1zW3JlY29yZElkUGFyYW1dO1xuICAgIGNvbnN0IHJlc291cmNlID0gcmVjb3JkLnBhcmFtc1tyZXNvdXJjZUlkUGFyYW1dO1xuICAgIGNvbnN0IHJlY29yZFRpdGxlID0gcmVjb3JkLnBhcmFtc1tyZWNvcmRUaXRsZVBhcmFtXTtcbiAgICBpZiAoIXJlY29yZElkIHx8ICFyZXNvdXJjZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7IGhyZWY6IHZpZXdIZWxwZXJzLnJlY29yZEFjdGlvblVybCh7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3Nob3cnLFxuICAgICAgICAgICAgICAgIHJlY29yZElkLFxuICAgICAgICAgICAgICAgIHJlc291cmNlSWQ6IHJlc291cmNlLFxuICAgICAgICAgICAgfSkgfSwgcmVjb3JkVGl0bGUpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgUmVjb3JkTGluaztcbiIsImltcG9ydCB7IERyb3Bab25lLCBEcm9wWm9uZUl0ZW0sIEZvcm1Hcm91cCwgTGFiZWwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmNvbnN0IEVkaXQgPSAoeyBwcm9wZXJ0eSwgcmVjb3JkLCBvbkNoYW5nZSB9KSA9PiB7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVQcm9wZXJ0eSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCB7IHBhcmFtcyB9ID0gcmVjb3JkO1xuICAgIGNvbnN0IHsgY3VzdG9tIH0gPSBwcm9wZXJ0eTtcbiAgICBjb25zdCBwYXRoID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSk7XG4gICAgY29uc3Qga2V5ID0gZmxhdC5nZXQocGFyYW1zLCBjdXN0b20ua2V5UHJvcGVydHkpO1xuICAgIGNvbnN0IGZpbGUgPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5maWxlUHJvcGVydHkpO1xuICAgIGNvbnN0IFtvcmlnaW5hbEtleSwgc2V0T3JpZ2luYWxLZXldID0gdXNlU3RhdGUoa2V5KTtcbiAgICBjb25zdCBbZmlsZXNUb1VwbG9hZCwgc2V0RmlsZXNUb1VwbG9hZF0gPSB1c2VTdGF0ZShbXSk7XG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgLy8gaXQgbWVhbnMgbWVhbnMgdGhhdCBzb21lb25lIGhpdCBzYXZlIGFuZCBuZXcgZmlsZSBoYXMgYmVlbiB1cGxvYWRlZFxuICAgICAgICAvLyBpbiB0aGlzIGNhc2UgZmxpZXNUb1VwbG9hZCBzaG91bGQgYmUgY2xlYXJlZC5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zIHdoZW4gdXNlciB0dXJucyBvZmYgcmVkaXJlY3QgYWZ0ZXIgbmV3L2VkaXRcbiAgICAgICAgaWYgKCh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJyAmJiBrZXkgIT09IG9yaWdpbmFsS2V5KVxuICAgICAgICAgICAgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnICYmICFvcmlnaW5hbEtleSlcbiAgICAgICAgICAgIHx8ICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJyAmJiBBcnJheS5pc0FycmF5KGtleSkgJiYga2V5Lmxlbmd0aCAhPT0gb3JpZ2luYWxLZXkubGVuZ3RoKSkge1xuICAgICAgICAgICAgc2V0T3JpZ2luYWxLZXkoa2V5KTtcbiAgICAgICAgICAgIHNldEZpbGVzVG9VcGxvYWQoW10pO1xuICAgICAgICB9XG4gICAgfSwgW2tleSwgb3JpZ2luYWxLZXldKTtcbiAgICBjb25zdCBvblVwbG9hZCA9IChmaWxlcykgPT4ge1xuICAgICAgICBzZXRGaWxlc1RvVXBsb2FkKGZpbGVzKTtcbiAgICAgICAgb25DaGFuZ2UoY3VzdG9tLmZpbGVQcm9wZXJ0eSwgZmlsZXMpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlUmVtb3ZlID0gKCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShjdXN0b20uZmlsZVByb3BlcnR5LCBudWxsKTtcbiAgICB9O1xuICAgIGNvbnN0IGhhbmRsZU11bHRpUmVtb3ZlID0gKHNpbmdsZUtleSkgPT4ge1xuICAgICAgICBjb25zdCBpbmRleCA9IChmbGF0LmdldChyZWNvcmQucGFyYW1zLCBjdXN0b20ua2V5UHJvcGVydHkpIHx8IFtdKS5pbmRleE9mKHNpbmdsZUtleSk7XG4gICAgICAgIGNvbnN0IGZpbGVzVG9EZWxldGUgPSBmbGF0LmdldChyZWNvcmQucGFyYW1zLCBjdXN0b20uZmlsZXNUb0RlbGV0ZVByb3BlcnR5KSB8fCBbXTtcbiAgICAgICAgaWYgKHBhdGggJiYgcGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5tYXAoKGN1cnJlbnRQYXRoLCBpKSA9PiAoaSAhPT0gaW5kZXggPyBjdXJyZW50UGF0aCA6IG51bGwpKTtcbiAgICAgICAgICAgIGxldCBuZXdQYXJhbXMgPSBmbGF0LnNldChyZWNvcmQucGFyYW1zLCBjdXN0b20uZmlsZXNUb0RlbGV0ZVByb3BlcnR5LCBbLi4uZmlsZXNUb0RlbGV0ZSwgaW5kZXhdKTtcbiAgICAgICAgICAgIG5ld1BhcmFtcyA9IGZsYXQuc2V0KG5ld1BhcmFtcywgY3VzdG9tLmZpbGVQYXRoUHJvcGVydHksIG5ld1BhdGgpO1xuICAgICAgICAgICAgb25DaGFuZ2Uoe1xuICAgICAgICAgICAgICAgIC4uLnJlY29yZCxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IG5ld1BhcmFtcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgY2Fubm90IHJlbW92ZSBmaWxlIHdoZW4gdGhlcmUgYXJlIG5vIHVwbG9hZGVkIGZpbGVzIHlldCcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCB0cmFuc2xhdGVQcm9wZXJ0eShwcm9wZXJ0eS5sYWJlbCwgcHJvcGVydHkucmVzb3VyY2VJZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lLCB7IG9uQ2hhbmdlOiBvblVwbG9hZCwgbXVsdGlwbGU6IGN1c3RvbS5tdWx0aXBsZSwgdmFsaWRhdGU6IHtcbiAgICAgICAgICAgICAgICBtaW1lVHlwZXM6IGN1c3RvbS5taW1lVHlwZXMsXG4gICAgICAgICAgICAgICAgbWF4U2l6ZTogY3VzdG9tLm1heFNpemUsXG4gICAgICAgICAgICB9LCBmaWxlczogZmlsZXNUb1VwbG9hZCB9KSxcbiAgICAgICAgIWN1c3RvbS5tdWx0aXBsZSAmJiBrZXkgJiYgcGF0aCAmJiAhZmlsZXNUb1VwbG9hZC5sZW5ndGggJiYgZmlsZSAhPT0gbnVsbCAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsgZmlsZW5hbWU6IGtleSwgc3JjOiBwYXRoLCBvblJlbW92ZTogaGFuZGxlUmVtb3ZlIH0pKSxcbiAgICAgICAgY3VzdG9tLm11bHRpcGxlICYmIGtleSAmJiBrZXkubGVuZ3RoICYmIHBhdGggPyAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwga2V5Lm1hcCgoc2luZ2xlS2V5LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgLy8gd2hlbiB3ZSByZW1vdmUgaXRlbXMgd2Ugc2V0IG9ubHkgcGF0aCBpbmRleCB0byBudWxscy5cbiAgICAgICAgICAgIC8vIGtleSBpcyBzdGlsbCB0aGVyZS4gVGhpcyBpcyBiZWNhdXNlXG4gICAgICAgICAgICAvLyB3ZSBoYXZlIHRvIG1haW50YWluIGFsbCB0aGUgaW5kZXhlcy4gU28gaGVyZSB3ZSBzaW1wbHkgZmlsdGVyIG91dCBlbGVtZW50cyB3aGljaFxuICAgICAgICAgICAgLy8gd2VyZSByZW1vdmVkIGFuZCBkaXNwbGF5IG9ubHkgd2hhdCB3YXMgbGVmdFxuICAgICAgICAgICAgY29uc3QgY3VycmVudFBhdGggPSBwYXRoW2luZGV4XTtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50UGF0aCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBrZXk6IHNpbmdsZUtleSwgZmlsZW5hbWU6IHNpbmdsZUtleSwgc3JjOiBwYXRoW2luZGV4XSwgb25SZW1vdmU6ICgpID0+IGhhbmRsZU11bHRpUmVtb3ZlKHNpbmdsZUtleSkgfSkpIDogJyc7XG4gICAgICAgIH0pKSkgOiAnJykpO1xufTtcbmV4cG9ydCBkZWZhdWx0IEVkaXQ7XG4iLCJleHBvcnQgY29uc3QgQXVkaW9NaW1lVHlwZXMgPSBbXG4gICAgJ2F1ZGlvL2FhYycsXG4gICAgJ2F1ZGlvL21pZGknLFxuICAgICdhdWRpby94LW1pZGknLFxuICAgICdhdWRpby9tcGVnJyxcbiAgICAnYXVkaW8vb2dnJyxcbiAgICAnYXBwbGljYXRpb24vb2dnJyxcbiAgICAnYXVkaW8vb3B1cycsXG4gICAgJ2F1ZGlvL3dhdicsXG4gICAgJ2F1ZGlvL3dlYm0nLFxuICAgICdhdWRpby8zZ3BwMicsXG5dO1xuZXhwb3J0IGNvbnN0IFZpZGVvTWltZVR5cGVzID0gW1xuICAgICd2aWRlby94LW1zdmlkZW8nLFxuICAgICd2aWRlby9tcGVnJyxcbiAgICAndmlkZW8vb2dnJyxcbiAgICAndmlkZW8vbXAydCcsXG4gICAgJ3ZpZGVvL3dlYm0nLFxuICAgICd2aWRlby8zZ3BwJyxcbiAgICAndmlkZW8vM2dwcDInLFxuXTtcbmV4cG9ydCBjb25zdCBJbWFnZU1pbWVUeXBlcyA9IFtcbiAgICAnaW1hZ2UvYm1wJyxcbiAgICAnaW1hZ2UvZ2lmJyxcbiAgICAnaW1hZ2UvanBlZycsXG4gICAgJ2ltYWdlL3BuZycsXG4gICAgJ2ltYWdlL3N2Zyt4bWwnLFxuICAgICdpbWFnZS92bmQubWljcm9zb2Z0Lmljb24nLFxuICAgICdpbWFnZS90aWZmJyxcbiAgICAnaW1hZ2Uvd2VicCcsXG5dO1xuZXhwb3J0IGNvbnN0IENvbXByZXNzZWRNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL3gtYnppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtYnppcDInLFxuICAgICdhcHBsaWNhdGlvbi9nemlwJyxcbiAgICAnYXBwbGljYXRpb24vamF2YS1hcmNoaXZlJyxcbiAgICAnYXBwbGljYXRpb24veC10YXInLFxuICAgICdhcHBsaWNhdGlvbi96aXAnLFxuICAgICdhcHBsaWNhdGlvbi94LTd6LWNvbXByZXNzZWQnLFxuXTtcbmV4cG9ydCBjb25zdCBEb2N1bWVudE1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24veC1hYml3b3JkJyxcbiAgICAnYXBwbGljYXRpb24veC1mcmVlYXJjJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLmFtYXpvbi5lYm9vaycsXG4gICAgJ2FwcGxpY2F0aW9uL21zd29yZCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC53b3JkcHJvY2Vzc2luZ21sLmRvY3VtZW50JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLWZvbnRvYmplY3QnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnByZXNlbnRhdGlvbicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQuc3ByZWFkc2hlZXQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub2FzaXMub3BlbmRvY3VtZW50LnRleHQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vcGVueG1sZm9ybWF0cy1vZmZpY2Vkb2N1bWVudC5wcmVzZW50YXRpb25tbC5wcmVzZW50YXRpb24nLFxuICAgICdhcHBsaWNhdGlvbi92bmQucmFyJyxcbiAgICAnYXBwbGljYXRpb24vcnRmJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnNwcmVhZHNoZWV0bWwuc2hlZXQnLFxuXTtcbmV4cG9ydCBjb25zdCBUZXh0TWltZVR5cGVzID0gW1xuICAgICd0ZXh0L2NzcycsXG4gICAgJ3RleHQvY3N2JyxcbiAgICAndGV4dC9odG1sJyxcbiAgICAndGV4dC9jYWxlbmRhcicsXG4gICAgJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdhcHBsaWNhdGlvbi9sZCtqc29uJyxcbiAgICAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAndGV4dC9wbGFpbicsXG4gICAgJ2FwcGxpY2F0aW9uL3hodG1sK3htbCcsXG4gICAgJ2FwcGxpY2F0aW9uL3htbCcsXG4gICAgJ3RleHQveG1sJyxcbl07XG5leHBvcnQgY29uc3QgQmluYXJ5RG9jc01pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24vZXB1Yit6aXAnLFxuICAgICdhcHBsaWNhdGlvbi9wZGYnLFxuXTtcbmV4cG9ydCBjb25zdCBGb250TWltZVR5cGVzID0gW1xuICAgICdmb250L290ZicsXG4gICAgJ2ZvbnQvdHRmJyxcbiAgICAnZm9udC93b2ZmJyxcbiAgICAnZm9udC93b2ZmMicsXG5dO1xuZXhwb3J0IGNvbnN0IE90aGVyTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICdhcHBsaWNhdGlvbi94LWNzaCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5hcHBsZS5pbnN0YWxsZXIreG1sJyxcbiAgICAnYXBwbGljYXRpb24veC1odHRwZC1waHAnLFxuICAgICdhcHBsaWNhdGlvbi94LXNoJyxcbiAgICAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnLFxuICAgICd2bmQudmlzaW8nLFxuICAgICdhcHBsaWNhdGlvbi92bmQubW96aWxsYS54dWwreG1sJyxcbl07XG5leHBvcnQgY29uc3QgTWltZVR5cGVzID0gW1xuICAgIC4uLkF1ZGlvTWltZVR5cGVzLFxuICAgIC4uLlZpZGVvTWltZVR5cGVzLFxuICAgIC4uLkltYWdlTWltZVR5cGVzLFxuICAgIC4uLkNvbXByZXNzZWRNaW1lVHlwZXMsXG4gICAgLi4uRG9jdW1lbnRNaW1lVHlwZXMsXG4gICAgLi4uVGV4dE1pbWVUeXBlcyxcbiAgICAuLi5CaW5hcnlEb2NzTWltZVR5cGVzLFxuICAgIC4uLk90aGVyTWltZVR5cGVzLFxuICAgIC4uLkZvbnRNaW1lVHlwZXMsXG4gICAgLi4uT3RoZXJNaW1lVHlwZXMsXG5dO1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQm94LCBCdXR0b24sIEljb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IGZsYXQgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBdWRpb01pbWVUeXBlcywgSW1hZ2VNaW1lVHlwZXMgfSBmcm9tICcuLi90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMnO1xuY29uc3QgU2luZ2xlRmlsZSA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgbmFtZSwgcGF0aCwgbWltZVR5cGUsIHdpZHRoIH0gPSBwcm9wcztcbiAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCkge1xuICAgICAgICBpZiAobWltZVR5cGUgJiYgSW1hZ2VNaW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IHBhdGgsIHN0eWxlOiB7IG1heEhlaWdodDogd2lkdGgsIG1heFdpZHRoOiB3aWR0aCB9LCBhbHQ6IG5hbWUgfSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtaW1lVHlwZSAmJiBBdWRpb01pbWVUeXBlcy5pbmNsdWRlcyhtaW1lVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIsIHsgY29udHJvbHM6IHRydWUsIHNyYzogcGF0aCB9LFxuICAgICAgICAgICAgICAgIFwiWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlXCIsXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImNvZGVcIiwgbnVsbCwgXCJhdWRpb1wiKSxcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJhY2tcIiwgeyBraW5kOiBcImNhcHRpb25zXCIgfSkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyBhczogXCJhXCIsIGhyZWY6IHBhdGgsIG1sOiBcImRlZmF1bHRcIiwgc2l6ZTogXCJzbVwiLCByb3VuZGVkOiB0cnVlLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWNvbiwgeyBpY29uOiBcIkRvY3VtZW50RG93bmxvYWRcIiwgY29sb3I6IFwid2hpdGVcIiwgbXI6IFwiZGVmYXVsdFwiIH0pLFxuICAgICAgICAgICAgbmFtZSkpKTtcbn07XG5jb25zdCBGaWxlID0gKHsgd2lkdGgsIHJlY29yZCwgcHJvcGVydHkgfSkgPT4ge1xuICAgIGNvbnN0IHsgY3VzdG9tIH0gPSBwcm9wZXJ0eTtcbiAgICBsZXQgcGF0aCA9IGZsYXQuZ2V0KHJlY29yZD8ucGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBuYW1lID0gZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5maWxlTmFtZVByb3BlcnR5ID8gY3VzdG9tLmZpbGVOYW1lUHJvcGVydHkgOiBjdXN0b20ua2V5UHJvcGVydHkpO1xuICAgIGNvbnN0IG1pbWVUeXBlID0gY3VzdG9tLm1pbWVUeXBlUHJvcGVydHlcbiAgICAgICAgJiYgZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5taW1lVHlwZVByb3BlcnR5KTtcbiAgICBpZiAoIXByb3BlcnR5LmN1c3RvbS5tdWx0aXBsZSkge1xuICAgICAgICBpZiAoY3VzdG9tLm9wdHMgJiYgY3VzdG9tLm9wdHMuYmFzZVVybCkge1xuICAgICAgICAgICAgcGF0aCA9IGAke2N1c3RvbS5vcHRzLmJhc2VVcmx9LyR7bmFtZX1gO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChTaW5nbGVGaWxlLCB7IHBhdGg6IHBhdGgsIG5hbWU6IG5hbWUsIHdpZHRoOiB3aWR0aCwgbWltZVR5cGU6IG1pbWVUeXBlIH0pKTtcbiAgICB9XG4gICAgaWYgKGN1c3RvbS5vcHRzICYmIGN1c3RvbS5vcHRzLmJhc2VVcmwpIHtcbiAgICAgICAgY29uc3QgYmFzZVVybCA9IGN1c3RvbS5vcHRzLmJhc2VVcmwgfHwgJyc7XG4gICAgICAgIHBhdGggPSBwYXRoLm1hcCgoc2luZ2xlUGF0aCwgaW5kZXgpID0+IGAke2Jhc2VVcmx9LyR7bmFtZVtpbmRleF19YCk7XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgcGF0aC5tYXAoKHNpbmdsZVBhdGgsIGluZGV4KSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChTaW5nbGVGaWxlLCB7IGtleTogc2luZ2xlUGF0aCwgcGF0aDogc2luZ2xlUGF0aCwgbmFtZTogbmFtZVtpbmRleF0sIHdpZHRoOiB3aWR0aCwgbWltZVR5cGU6IG1pbWVUeXBlW2luZGV4XSB9KSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRmlsZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnO1xuY29uc3QgTGlzdCA9IChwcm9wcykgPT4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZSwgeyB3aWR0aDogMTAwLCAuLi5wcm9wcyB9KSk7XG5leHBvcnQgZGVmYXVsdCBMaXN0O1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMYWJlbCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgRmlsZSBmcm9tICcuL2ZpbGUuanMnO1xuY29uc3QgU2hvdyA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgcHJvcGVydHkgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlUHJvcGVydHkgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgdHJhbnNsYXRlUHJvcGVydHkocHJvcGVydHkubGFiZWwsIHByb3BlcnR5LnJlc291cmNlSWQpKSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlLCB7IHdpZHRoOiBcIjEwMCVcIiwgLi4ucHJvcHMgfSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBTaG93O1xuIiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgTG9naW4gZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0xvZ2luJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dpbiA9IExvZ2luXG5pbXBvcnQgTG9nZ2VkSW4gZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0xvZ2dlZEluJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Mb2dnZWRJbiA9IExvZ2dlZEluXG5pbXBvcnQgRGFzaGJvYXJkIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9EYXNoYm9hcmQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRhc2hib2FyZCA9IERhc2hib2FyZFxuaW1wb3J0IFNjaGVtZVVwbG9hZCBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvU2NoZW1lVXBsb2FkJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TY2hlbWVVcGxvYWQgPSBTY2hlbWVVcGxvYWRcbmltcG9ydCBTY2hlbWVUeXBlU2VsZWN0RWRpdCBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvU2NoZW1lVHlwZVNlbGVjdEVkaXQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNjaGVtZVR5cGVTZWxlY3RFZGl0ID0gU2NoZW1lVHlwZVNlbGVjdEVkaXRcbmltcG9ydCBFcnJvck1lc3NhZ2UgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0Vycm9yTWVzc2FnZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRXJyb3JNZXNzYWdlID0gRXJyb3JNZXNzYWdlXG5pbXBvcnQgUmVjb3JkRGlmZmVyZW5jZSBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZERpZmZlcmVuY2UnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZERpZmZlcmVuY2UgPSBSZWNvcmREaWZmZXJlbmNlXG5pbXBvcnQgUmVjb3JkTGluayBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZExpbmsnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlJlY29yZExpbmsgPSBSZWNvcmRMaW5rXG5pbXBvcnQgVXBsb2FkRWRpdENvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkRWRpdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkRWRpdENvbXBvbmVudCA9IFVwbG9hZEVkaXRDb21wb25lbnRcbmltcG9ydCBVcGxvYWRMaXN0Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRMaXN0Q29tcG9uZW50ID0gVXBsb2FkTGlzdENvbXBvbmVudFxuaW1wb3J0IFVwbG9hZFNob3dDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZFNob3dDb21wb25lbnQgPSBVcGxvYWRTaG93Q29tcG9uZW50Il0sIm5hbWVzIjpbIldyYXBwZXIiLCJzdHlsZWQiLCJCb3giLCJTdHlsZWRMb2dvIiwiaW1nIiwidGhlbWVHZXQiLCJJbGx1c3RyYXRpb25zV3JhcHBlciIsIkxvZ2luIiwicHJvcHMiLCJ3aW5kb3ciLCJfX0FQUF9TVEFURV9fIiwiYWN0aW9uIiwiZXJyb3JNZXNzYWdlIiwidHJhbnNsYXRlQ29tcG9uZW50IiwidHJhbnNsYXRlTWVzc2FnZSIsInVzZVRyYW5zbGF0aW9uIiwiYnJhbmRpbmciLCJ1c2VTZWxlY3RvciIsInN0YXRlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiLCJmbGV4IiwidmFyaWFudCIsImJnIiwiaGVpZ2h0IiwiYm94U2hhZG93Iiwid2lkdGgiLCJjb2xvciIsInAiLCJmbGV4R3JvdyIsImRpc3BsYXkiLCJwb3NpdGlvbiIsIkgyIiwiZm9udFdlaWdodCIsIlRleHQiLCJtdCIsIm1yIiwiSWxsdXN0cmF0aW9uIiwidG9wIiwiYXMiLCJtZXRob2QiLCJINSIsIm1hcmdpbkJvdHRvbSIsImxvZ28iLCJzcmMiLCJhbHQiLCJjb21wYW55TmFtZSIsIk1lc3NhZ2VCb3giLCJteSIsIm1lc3NhZ2UiLCJzcGxpdCIsImxlbmd0aCIsIkZvcm1Hcm91cCIsIkxhYmVsIiwicmVxdWlyZWQiLCJJbnB1dCIsIm5hbWUiLCJwbGFjZWhvbGRlciIsInR5cGUiLCJhdXRvQ29tcGxldGUiLCJ0ZXh0QWxpZ24iLCJCdXR0b24iLCJ3aXRoTWFkZVdpdGhMb3ZlIiwiTWFkZVdpdGhMb3ZlIiwiTG9nZ2VkSW4iLCJzZXNzaW9uIiwicGF0aHMiLCJ0cmFuc2xhdGVCdXR0b24iLCJkcm9wQWN0aW9ucyIsImxhYmVsIiwib25DbGljayIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJsb2NhdGlvbiIsImhyZWYiLCJpZCIsImljb24iLCJsb2dvdXRQYXRoIiwiZmxleFNocmluayIsIkN1cnJlbnRVc2VyTmF2IiwiZW1haWwiLCJ0aXRsZSIsImF2YXRhclVybCIsIkRhc2hib2FyZCIsIkgxIiwiU2NoZW1lVXBsb2FkIiwib25DaGFuZ2UiLCJwcm9wZXJ0eSIsInJlY29yZCIsIl8iLCJzZXRGaWxlIiwidXNlU3RhdGUiLCJzY2hlbWVTaXplIiwicGFyYW1zIiwic2NoZW1lX3NpemUiLCJzY2hlbWVWZXJzaW9uIiwiRGF0ZSIsInNjaGVtZV92ZXJzaW9uIiwidG9Mb2NhbGVTdHJpbmciLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJ0bSIsImhhbmRsZURyb3AiLCJmaWxlcyIsImVycm9yIiwiZXJyb3JzIiwicGF0aCIsIkJvb2xlYW4iLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiUHJvcGVydHlMYWJlbCIsIkRyb3Bab25lIiwiRHJvcFpvbmVJdGVtIiwiZmlsZW5hbWUiLCJGb3JtTWVzc2FnZSIsInJlc291cmNlSWQiLCJTY2hlbWVUeXBlU2VsZWN0RWRpdCIsImF2YWlsYWJsZVZhbHVlcyIsInByb3BWYWx1ZSIsInZhbHVlIiwibWFwIiwidiIsImRlZmF1bHRWYWx1ZSIsInNlbGVjdGVkIiwiZmluZCIsImF2Iiwib3BhY2l0eSIsIlNlbGVjdCIsIm9wdGlvbnMiLCJzIiwiaXNEaXNhYmxlZCIsIkVycm9yTWVzc2FnZSIsIlRhYmxlQ2VsbCIsIlRhYmxlUm93IiwiVGFibGVIZWFkIiwiQWRtaW5UYWJsZSIsImZsYXQiLCJUYWJsZUJvZHkiLCJWaWV3SGVscGVycyIsIkxpbmsiLCJ1c2VFZmZlY3QiLCJJY29uIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiUmVjb3JkRGlmZmVyZW5jZSIsIlJlY29yZExpbmsiLCJVcGxvYWRFZGl0Q29tcG9uZW50IiwiVXBsb2FkTGlzdENvbXBvbmVudCIsIlVwbG9hZFNob3dDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7RUFLQSxNQUFNQSxPQUFPLEdBQUdDLHVCQUFNLENBQUNDLGdCQUFHLENBQUU7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0VBQ0QsTUFBTUMsVUFBVSxHQUFHRix1QkFBTSxDQUFDRyxHQUFJO0FBQzlCO0FBQ0EsVUFBQSxFQUFZQyxxQkFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNuQyxDQUFDO0VBQ0QsTUFBTUMsb0JBQW9CLEdBQUdMLHVCQUFNLENBQUNDLGdCQUFHLENBQUU7QUFDekM7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
