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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9nZ2VkSW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVVwbG9hZC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9FcnJvck1lc3NhZ2UuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZERpZmZlcmVuY2UuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi91dGlscy9nZXQtbG9nLXByb3BlcnR5LW5hbWUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvbG9nZ2VyL2xpYi9jb21wb25lbnRzL1JlY29yZExpbmsuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkRWRpdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvdHlwZXMvbWltZS10eXBlcy50eXBlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL2ZpbGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50LmpzIiwiZW50cnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVNlbGVjdG9yIH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHsgQm94LCBINSwgSDIsIExhYmVsLCBJbGx1c3RyYXRpb24sIElucHV0LCBGb3JtR3JvdXAsIEJ1dHRvbiwgVGV4dCwgTWVzc2FnZUJveCwgTWFkZVdpdGhMb3ZlLCB0aGVtZUdldCwgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHN0eWxlZCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmNvbnN0IFdyYXBwZXIgPSBzdHlsZWQoQm94KSBgXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG5gO1xuY29uc3QgU3R5bGVkTG9nbyA9IHN0eWxlZC5pbWcgYFxuICBtYXgtd2lkdGg6IDIwMHB4O1xuICBtYXJnaW46ICR7dGhlbWVHZXQoJ3NwYWNlJywgJ21kJyl9IDA7XG5gO1xuY29uc3QgSWxsdXN0cmF0aW9uc1dyYXBwZXIgPSBzdHlsZWQoQm94KSBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICYgc3ZnIFtzdHJva2U9JyMzQjM1NTInXSB7XG4gICAgc3Ryb2tlOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNSk7XG4gIH1cbiAgJiBzdmcgW2ZpbGw9JyMzMDQwRDYnXSB7XG4gICAgZmlsbDogcmdiYSgyNTUsIDI1NSwgMjU1LCAxKTtcbiAgfVxuYDtcbmV4cG9ydCBjb25zdCBMb2dpbiA9ICgpID0+IHtcbiAgICBjb25zdCBwcm9wcyA9IHdpbmRvdy5fX0FQUF9TVEFURV9fO1xuICAgIGNvbnN0IHsgYWN0aW9uLCBlcnJvck1lc3NhZ2UgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdHJhbnNsYXRlQ29tcG9uZW50LCB0cmFuc2xhdGVNZXNzYWdlIH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IGJyYW5kaW5nID0gdXNlU2VsZWN0b3IoKHN0YXRlKSA9PiBzdGF0ZS5icmFuZGluZyk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFdyYXBwZXIsIHsgZmxleDogdHJ1ZSwgdmFyaWFudDogXCJncmV5XCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGJnOiBcIndoaXRlXCIsIGhlaWdodDogXCI0ODBweFwiLCBmbGV4OiB0cnVlLCBib3hTaGFkb3c6IFwibG9naW5cIiwgd2lkdGg6IFsxLCAyIC8gMywgJ2F1dG8nXSB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGJnOiBcInByaW1hcnkxMDBcIiwgY29sb3I6IFwid2hpdGVcIiwgcDogXCJ4M1wiLCB3aWR0aDogXCIzODBweFwiLCBmbGV4R3JvdzogMCwgZGlzcGxheTogWydub25lJywgJ25vbmUnLCAnYmxvY2snXSwgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEgyLCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiIH0sIFwiR0VOVFJBSU4gQWRtaW5cIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dCwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiwgbXQ6IFwiZGVmYXVsdFwiIH0sIFwiV2VsY29tZSB0byB0aGUgR0VOVFJBSU4gYWRtaW4gcGFuZWwuXCIpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbnNXcmFwcGVyLCB7IHA6IFwieHhsXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIsIG1yOiBcImRlZmF1bHRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWxsdXN0cmF0aW9uLCB7IHZhcmlhbnQ6IFwiUGxhbmV0XCIsIHdpZHRoOiA4MiwgaGVpZ2h0OiA5MSB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBkaXNwbGF5OiBcImlubGluZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJBc3Ryb25hdXRcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIsIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHRvcDogXCItMjBweFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJGbGFnSW5Db2dcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSkpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGFzOiBcImZvcm1cIiwgYWN0aW9uOiBhY3Rpb24sIG1ldGhvZDogXCJQT1NUXCIsIHA6IFwieDNcIiwgZmxleEdyb3c6IDEsIHdpZHRoOiBbJzEwMCUnLCAnMTAwJScsICc0ODBweCddIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDUsIHsgbWFyZ2luQm90dG9tOiBcInh4bFwiIH0sIGJyYW5kaW5nLmxvZ28gPyBSZWFjdC5jcmVhdGVFbGVtZW50KFN0eWxlZExvZ28sIHsgc3JjOiBicmFuZGluZy5sb2dvLCBhbHQ6IGJyYW5kaW5nLmNvbXBhbnlOYW1lIH0pIDogYnJhbmRpbmcuY29tcGFueU5hbWUpLFxuICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgJiYgKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWVzc2FnZUJveCwgeyBteTogXCJsZ1wiLCBtZXNzYWdlOiBlcnJvck1lc3NhZ2Uuc3BsaXQoJyAnKS5sZW5ndGggPiAxID8gZXJyb3JNZXNzYWdlIDogJ1dyb25nIHVzZXJuYW1lIGFuZC9vciBwYXNzd29yZCcsIHZhcmlhbnQ6IFwiZGFuZ2VyXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgcmVxdWlyZWQ6IHRydWUgfSwgXCJVc2VybmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHsgbmFtZTogXCJlbWFpbFwiLCBwbGFjZWhvbGRlcjogXCJVc2VybmFtZVwiIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCB7IHJlcXVpcmVkOiB0cnVlIH0sIHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ucHJvcGVydGllcy5wYXNzd29yZCcpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIHsgdHlwZTogXCJwYXNzd29yZFwiLCBuYW1lOiBcInBhc3N3b3JkXCIsIHBsYWNlaG9sZGVyOiB0cmFuc2xhdGVDb21wb25lbnQoJ0xvZ2luLnByb3BlcnRpZXMucGFzc3dvcmQnKSwgYXV0b0NvbXBsZXRlOiBcIm5ldy1wYXNzd29yZFwiIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IG10OiBcInhsXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCdXR0b24sIHsgdmFyaWFudDogXCJjb250YWluZWRcIiB9LCB0cmFuc2xhdGVDb21wb25lbnQoJ0xvZ2luLmxvZ2luQnV0dG9uJykpKSkpLFxuICAgICAgICAgICAgYnJhbmRpbmcud2l0aE1hZGVXaXRoTG92ZSA/IChSZWFjdC5jcmVhdGVFbGVtZW50KEJveCwgeyBtdDogXCJ4eGxcIiB9LFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTWFkZVdpdGhMb3ZlLCBudWxsKSkpIDogbnVsbCkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBMb2dpbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDdXJyZW50VXNlck5hdiwgQm94IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgTG9nZ2VkSW4gPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHNlc3Npb24sIHBhdGhzIH0gPSBwcm9wcztcbiAgICBjb25zdCB7IHRyYW5zbGF0ZUJ1dHRvbiB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBjb25zdCBkcm9wQWN0aW9ucyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdFZGl0IHByb2ZpbGUnLFxuICAgICAgICAgICAgb25DbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvYWRtaW4vcmVzb3VyY2VzL3VzZXIvcmVjb3Jkcy8ke3Nlc3Npb24uaWR9L2VkaXRgO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGljb246ICdVc2VyJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6IHRyYW5zbGF0ZUJ1dHRvbignbG9nb3V0JyksXG4gICAgICAgICAgICBvbkNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcGF0aHMubG9nb3V0UGF0aDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpY29uOiAnTG9nT3V0JyxcbiAgICAgICAgfSxcbiAgICBdO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZmxleFNocmluazogMCwgXCJkYXRhLWNzc1wiOiBcImxvZ2dlZC1pblwiIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ3VycmVudFVzZXJOYXYsIHsgbmFtZTogc2Vzc2lvbi5lbWFpbCwgdGl0bGU6IHNlc3Npb24udGl0bGUsIGF2YXRhclVybDogc2Vzc2lvbi5hdmF0YXJVcmwsIGRyb3BBY3Rpb25zOiBkcm9wQWN0aW9ucyB9KSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IExvZ2dlZEluO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgSDEsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwiZ3JleVwiIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwid2hpdGVcIiwgcDogXCJ4bFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDEsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dCwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiwgbXQ6IFwiZGVmYXVsdFwiIH0sIFwiV2VsY29tZSB0byB0aGUgR0VOVFJBSU4gYWRtaW4gcGFuZWwuIEhlcmUgeW91IGNhbiBtYW5hZ2UgdGhlIHBhdGhvZ2VuIGRhdGFiYXNlLCBjcmVhdGUgdXNlcnMgZm9yIHRoZSBhZG1pbiBwYW5lbCBhbmQgYXNzaWduIHVzZXIgcm9sZXMuIFVzZSB0aGUgbmF2aWdhdGlvbiBvbiB0aGUgbGVmdCBzaWRlYmFyIHRvIGFjY2VzcyBkaWZmZXJlbnQgc2VjdGlvbnMuXCIpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgRHJvcFpvbmUsIERyb3Bab25lSXRlbSwgRm9ybUdyb3VwLCBGb3JtTWVzc2FnZSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgUHJvcGVydHlMYWJlbCwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmNvbnN0IFNjaGVtZVVwbG9hZCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgb25DaGFuZ2UsIHByb3BlcnR5LCByZWNvcmQgfSA9IHByb3BzO1xuICAgIGNvbnN0IFtfLCBzZXRGaWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHNjaGVtZVNpemUgPSByZWNvcmQucGFyYW1zLnNjaGVtZV9zaXplO1xuICAgIGNvbnN0IHNjaGVtZVZlcnNpb24gPSBuZXcgRGF0ZShyZWNvcmQucGFyYW1zLnNjaGVtZV92ZXJzaW9uKS50b0xvY2FsZVN0cmluZygnZGUtREUnLCB7XG4gICAgICAgIGRhdGVTdHlsZTogJ3Nob3J0JyxcbiAgICAgICAgdGltZVN0eWxlOiAnc2hvcnQnLFxuICAgIH0pO1xuICAgIGNvbnN0IHsgdG0gfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgaGFuZGxlRHJvcCA9IChmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2V0RmlsZShmaWxlc1swXSk7XG4gICAgICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBmaWxlc1swXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgZXJyb3I6IEJvb2xlYW4oZXJyb3IpIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXg6IHRydWUsIHN0eWxlOiB7IGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQcm9wZXJ0eUxhYmVsLCB7IHByb3BlcnR5OiBwcm9wZXJ0eSB9KSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmUsIHsgb25DaGFuZ2U6IGhhbmRsZURyb3AgfSksXG4gICAgICAgIHNjaGVtZVZlcnNpb24gJiYgc2NoZW1lU2l6ZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsgZmlsZW5hbWU6IGBWZXJzaW9uOiA8JHtzY2hlbWVWZXJzaW9ufT4sIFNpemU6ICR7c2NoZW1lU2l6ZX0gTUJgLCBzcmM6ICd0ZXN0JyB9KSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybU1lc3NhZ2UsIG51bGwsIGVycm9yICYmIHRtKGVycm9yLm1lc3NhZ2UsIHByb3BlcnR5LnJlc291cmNlSWQpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtZVVwbG9hZDtcbiIsImltcG9ydCB7IFByb3BlcnR5TGFiZWwsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlLCBTZWxlY3QgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmNvbnN0IFNjaGVtZVR5cGVTZWxlY3RFZGl0ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZWNvcmQsIHByb3BlcnR5LCBvbkNoYW5nZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF07XG4gICAgY29uc3QgeyB0bSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBpZiAoIXByb3BlcnR5LmF2YWlsYWJsZVZhbHVlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcHJvcFZhbHVlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5LnBhdGhdID8/IHByb3BlcnR5LnByb3BzLnZhbHVlID8/ICcnO1xuICAgIGNvbnN0IGF2YWlsYWJsZVZhbHVlcyA9IHByb3BlcnR5LmF2YWlsYWJsZVZhbHVlcy5tYXAoKHYpID0+ICh7XG4gICAgICAgIC4uLnYsXG4gICAgICAgIGxhYmVsOiB0bShgJHtwcm9wZXJ0eS5wYXRofS4ke3YudmFsdWV9YCwgcHJvcGVydHkucmVzb3VyY2VJZCwgeyBkZWZhdWx0VmFsdWU6IHYubGFiZWwgPz8gdi52YWx1ZSB9KSxcbiAgICB9KSk7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBhdmFpbGFibGVWYWx1ZXMuZmluZCgoYXYpID0+IGF2LnZhbHVlID09IHByb3BWYWx1ZSk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBlcnJvcjogQm9vbGVhbihlcnJvcikgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQcm9wZXJ0eUxhYmVsLCB7IHByb3BlcnR5OiBwcm9wZXJ0eSB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgc3R5bGU6IHsgb3BhY2l0eTogcmVjb3JkLnBhcmFtcy5pZCA/IDAuNSA6IDEgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHsgdmFsdWU6IHNlbGVjdGVkLCBvcHRpb25zOiBhdmFpbGFibGVWYWx1ZXMsIG9uQ2hhbmdlOiAocykgPT4gb25DaGFuZ2UocHJvcGVydHkucGF0aCwgcz8udmFsdWUgPz8gJycpLCBpc0Rpc2FibGVkOiByZWNvcmQucGFyYW1zLmlkID8gdHJ1ZSA6IGZhbHNlLCAuLi5wcm9wZXJ0eS5wcm9wcyB9KSxcbiAgICAgICAgICAgICcgJyksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybU1lc3NhZ2UsIG51bGwsIGVycm9yICYmIHRtKGVycm9yLm1lc3NhZ2UsIHByb3BlcnR5LnJlc291cmNlSWQpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtZVR5cGVTZWxlY3RFZGl0O1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZvcm1Hcm91cCwgRm9ybU1lc3NhZ2UgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5jb25zdCBFcnJvck1lc3NhZ2UgPSAocHJvcHMpID0+IHtcbiAgICBjb25zdCB7IHByb3BlcnR5LCByZWNvcmQgfSA9IHByb3BzO1xuICAgIGNvbnN0IHsgdG0gfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF07XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBlcnJvciAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgZXJyb3I6IEJvb2xlYW4oZXJyb3IpIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybU1lc3NhZ2UsIG51bGwsIHRtKGVycm9yLm1lc3NhZ2UsIHByb3BlcnR5LnJlc291cmNlSWQpKSkpKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRXJyb3JNZXNzYWdlO1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMYWJlbCwgVGFibGUgYXMgQWRtaW5UYWJsZSwgVGFibGVCb2R5LCBUYWJsZUNlbGwsIFRhYmxlSGVhZCwgVGFibGVSb3csIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0IH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50cyc7XG5jb25zdCBDZWxsID0gc3R5bGVkKFRhYmxlQ2VsbCkgYFxuICB3aWR0aDogMTAwJTtcbiAgd29yZC1icmVhazogYnJlYWstd29yZDtcbmA7XG5jb25zdCBSb3cgPSBzdHlsZWQoVGFibGVSb3cpIGBcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHVuc2V0O1xuYDtcbmNvbnN0IEhlYWQgPSBzdHlsZWQoVGFibGVIZWFkKSBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiB1bnNldDtcbmA7XG5jb25zdCBUYWJsZSA9IHN0eWxlZChBZG1pblRhYmxlKSBgXG4gIHdpZHRoOiAxMDAlO1xuICBwb3NpdGlvbjogdW5zZXQ7XG4gIGRpc3BsYXk6IGJsb2NrO1xuYDtcbmNvbnN0IFJlY29yZERpZmZlcmVuY2UgPSAoeyByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBjb25zdCBkaWZmZXJlbmNlcyA9IEpTT04ucGFyc2UoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBmbGF0LnVuZmxhdHRlbihyZWNvcmQ/LnBhcmFtcyA/PyB7fSk/Lltwcm9wZXJ0eS5uYW1lXSA/PyB7fSk7XG4gICAgaWYgKCFkaWZmZXJlbmNlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgcHJvcGVydHkubGFiZWwpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIZWFkLCBudWxsLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIG51bGwsIFwiUHJvcGVydHkgbmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCBudWxsLCBcIkJlZm9yZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCBudWxsLCBcIkFmdGVyXCIpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlQm9keSwgbnVsbCwgT2JqZWN0LmVudHJpZXMoZGlmZmVyZW5jZXMpLm1hcCgoW3Byb3BlcnR5TmFtZSwgeyBiZWZvcmUsIGFmdGVyIH1dKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBrZXk6IHByb3BlcnR5TmFtZSB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIHsgd2lkdGg6IDEgLyAzIH0sIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgeyBjb2xvcjogXCJyZWRcIiwgd2lkdGg6IDEgLyAzIH0sIEpTT04uc3RyaW5naWZ5KGJlZm9yZSkgfHwgJ3VuZGVmaW5lZCcpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIHsgY29sb3I6IFwiZ3JlZW5cIiwgd2lkdGg6IDEgLyAzIH0sIEpTT04uc3RyaW5naWZ5KGFmdGVyKSB8fCAndW5kZWZpbmVkJykpKTtcbiAgICAgICAgICAgIH0pKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBSZWNvcmREaWZmZXJlbmNlO1xuIiwiZXhwb3J0IGNvbnN0IGdldExvZ1Byb3BlcnR5TmFtZSA9IChwcm9wZXJ0eSwgbWFwcGluZyA9IHt9KSA9PiB7XG4gICAgaWYgKCFtYXBwaW5nW3Byb3BlcnR5XSkge1xuICAgICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgfVxuICAgIHJldHVybiBtYXBwaW5nW3Byb3BlcnR5XTtcbn07XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExpbmsgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IFZpZXdIZWxwZXJzIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZ2V0TG9nUHJvcGVydHlOYW1lIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LWxvZy1wcm9wZXJ0eS1uYW1lLmpzJztcbmNvbnN0IHZpZXdIZWxwZXJzID0gbmV3IFZpZXdIZWxwZXJzKCk7XG5jb25zdCBSZWNvcmRMaW5rID0gKHsgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgaWYgKCFyZWNvcmQ/LnBhcmFtcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBjdXN0b20gPSB7fSB9ID0gcHJvcGVydHk7XG4gICAgY29uc3QgeyBwcm9wZXJ0aWVzTWFwcGluZyA9IHt9IH0gPSBjdXN0b207XG4gICAgY29uc3QgcmVjb3JkSWRQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZSgncmVjb3JkSWQnLCBwcm9wZXJ0aWVzTWFwcGluZyk7XG4gICAgY29uc3QgcmVzb3VyY2VJZFBhcmFtID0gZ2V0TG9nUHJvcGVydHlOYW1lKCdyZXNvdXJjZScsIHByb3BlcnRpZXNNYXBwaW5nKTtcbiAgICBjb25zdCByZWNvcmRUaXRsZVBhcmFtID0gZ2V0TG9nUHJvcGVydHlOYW1lKCdyZWNvcmRUaXRsZScsIHByb3BlcnRpZXNNYXBwaW5nKTtcbiAgICBjb25zdCByZWNvcmRJZCA9IHJlY29yZC5wYXJhbXNbcmVjb3JkSWRQYXJhbV07XG4gICAgY29uc3QgcmVzb3VyY2UgPSByZWNvcmQucGFyYW1zW3Jlc291cmNlSWRQYXJhbV07XG4gICAgY29uc3QgcmVjb3JkVGl0bGUgPSByZWNvcmQucGFyYW1zW3JlY29yZFRpdGxlUGFyYW1dO1xuICAgIGlmICghcmVjb3JkSWQgfHwgIXJlc291cmNlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgaHJlZjogdmlld0hlbHBlcnMucmVjb3JkQWN0aW9uVXJsKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnc2hvdycsXG4gICAgICAgICAgICAgICAgcmVjb3JkSWQsXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UsXG4gICAgICAgICAgICB9KSB9LCByZWNvcmRUaXRsZSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBSZWNvcmRMaW5rO1xuIiwiaW1wb3J0IHsgRHJvcFpvbmUsIERyb3Bab25lSXRlbSwgRm9ybUdyb3VwLCBMYWJlbCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuY29uc3QgRWRpdCA9ICh7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0pID0+IHtcbiAgICBjb25zdCB7IHRyYW5zbGF0ZVByb3BlcnR5IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IHsgcGFyYW1zIH0gPSByZWNvcmQ7XG4gICAgY29uc3QgeyBjdXN0b20gfSA9IHByb3BlcnR5O1xuICAgIGNvbnN0IHBhdGggPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5KTtcbiAgICBjb25zdCBrZXkgPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5rZXlQcm9wZXJ0eSk7XG4gICAgY29uc3QgZmlsZSA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmZpbGVQcm9wZXJ0eSk7XG4gICAgY29uc3QgW29yaWdpbmFsS2V5LCBzZXRPcmlnaW5hbEtleV0gPSB1c2VTdGF0ZShrZXkpO1xuICAgIGNvbnN0IFtmaWxlc1RvVXBsb2FkLCBzZXRGaWxlc1RvVXBsb2FkXSA9IHVzZVN0YXRlKFtdKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBpdCBtZWFucyBtZWFucyB0aGF0IHNvbWVvbmUgaGl0IHNhdmUgYW5kIG5ldyBmaWxlIGhhcyBiZWVuIHVwbG9hZGVkXG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSBmbGllc1RvVXBsb2FkIHNob3VsZCBiZSBjbGVhcmVkLlxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiB1c2VyIHR1cm5zIG9mZiByZWRpcmVjdCBhZnRlciBuZXcvZWRpdFxuICAgICAgICBpZiAoKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIGtleSAhPT0gb3JpZ2luYWxLZXkpXG4gICAgICAgICAgICB8fCAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgJiYgIW9yaWdpbmFsS2V5KVxuICAgICAgICAgICAgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnICYmIEFycmF5LmlzQXJyYXkoa2V5KSAmJiBrZXkubGVuZ3RoICE9PSBvcmlnaW5hbEtleS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBzZXRPcmlnaW5hbEtleShrZXkpO1xuICAgICAgICAgICAgc2V0RmlsZXNUb1VwbG9hZChbXSk7XG4gICAgICAgIH1cbiAgICB9LCBba2V5LCBvcmlnaW5hbEtleV0pO1xuICAgIGNvbnN0IG9uVXBsb2FkID0gKGZpbGVzKSA9PiB7XG4gICAgICAgIHNldEZpbGVzVG9VcGxvYWQoZmlsZXMpO1xuICAgICAgICBvbkNoYW5nZShjdXN0b20uZmlsZVByb3BlcnR5LCBmaWxlcyk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIG9uQ2hhbmdlKGN1c3RvbS5maWxlUHJvcGVydHksIG51bGwpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlTXVsdGlSZW1vdmUgPSAoc2luZ2xlS2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKGZsYXQuZ2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5rZXlQcm9wZXJ0eSkgfHwgW10pLmluZGV4T2Yoc2luZ2xlS2V5KTtcbiAgICAgICAgY29uc3QgZmlsZXNUb0RlbGV0ZSA9IGZsYXQuZ2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5maWxlc1RvRGVsZXRlUHJvcGVydHkpIHx8IFtdO1xuICAgICAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLm1hcCgoY3VycmVudFBhdGgsIGkpID0+IChpICE9PSBpbmRleCA/IGN1cnJlbnRQYXRoIDogbnVsbCkpO1xuICAgICAgICAgICAgbGV0IG5ld1BhcmFtcyA9IGZsYXQuc2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5maWxlc1RvRGVsZXRlUHJvcGVydHksIFsuLi5maWxlc1RvRGVsZXRlLCBpbmRleF0pO1xuICAgICAgICAgICAgbmV3UGFyYW1zID0gZmxhdC5zZXQobmV3UGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSwgbmV3UGF0aCk7XG4gICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgLi4ucmVjb3JkLFxuICAgICAgICAgICAgICAgIHBhcmFtczogbmV3UGFyYW1zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjYW5ub3QgcmVtb3ZlIGZpbGUgd2hlbiB0aGVyZSBhcmUgbm8gdXBsb2FkZWQgZmlsZXMgeWV0Jyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHRyYW5zbGF0ZVByb3BlcnR5KHByb3BlcnR5LmxhYmVsLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmUsIHsgb25DaGFuZ2U6IG9uVXBsb2FkLCBtdWx0aXBsZTogY3VzdG9tLm11bHRpcGxlLCB2YWxpZGF0ZToge1xuICAgICAgICAgICAgICAgIG1pbWVUeXBlczogY3VzdG9tLm1pbWVUeXBlcyxcbiAgICAgICAgICAgICAgICBtYXhTaXplOiBjdXN0b20ubWF4U2l6ZSxcbiAgICAgICAgICAgIH0sIGZpbGVzOiBmaWxlc1RvVXBsb2FkIH0pLFxuICAgICAgICAhY3VzdG9tLm11bHRpcGxlICYmIGtleSAmJiBwYXRoICYmICFmaWxlc1RvVXBsb2FkLmxlbmd0aCAmJiBmaWxlICE9PSBudWxsICYmIChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBmaWxlbmFtZToga2V5LCBzcmM6IHBhdGgsIG9uUmVtb3ZlOiBoYW5kbGVSZW1vdmUgfSkpLFxuICAgICAgICBjdXN0b20ubXVsdGlwbGUgJiYga2V5ICYmIGtleS5sZW5ndGggJiYgcGF0aCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBrZXkubWFwKChzaW5nbGVLZXksIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAvLyB3aGVuIHdlIHJlbW92ZSBpdGVtcyB3ZSBzZXQgb25seSBwYXRoIGluZGV4IHRvIG51bGxzLlxuICAgICAgICAgICAgLy8ga2V5IGlzIHN0aWxsIHRoZXJlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gbWFpbnRhaW4gYWxsIHRoZSBpbmRleGVzLiBTbyBoZXJlIHdlIHNpbXBseSBmaWx0ZXIgb3V0IGVsZW1lbnRzIHdoaWNoXG4gICAgICAgICAgICAvLyB3ZXJlIHJlbW92ZWQgYW5kIGRpc3BsYXkgb25seSB3aGF0IHdhcyBsZWZ0XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHBhdGhbaW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRQYXRoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGtleTogc2luZ2xlS2V5LCBmaWxlbmFtZTogc2luZ2xlS2V5LCBzcmM6IHBhdGhbaW5kZXhdLCBvblJlbW92ZTogKCkgPT4gaGFuZGxlTXVsdGlSZW1vdmUoc2luZ2xlS2V5KSB9KSkgOiAnJztcbiAgICAgICAgfSkpKSA6ICcnKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRWRpdDtcbiIsImV4cG9ydCBjb25zdCBBdWRpb01pbWVUeXBlcyA9IFtcbiAgICAnYXVkaW8vYWFjJyxcbiAgICAnYXVkaW8vbWlkaScsXG4gICAgJ2F1ZGlvL3gtbWlkaScsXG4gICAgJ2F1ZGlvL21wZWcnLFxuICAgICdhdWRpby9vZ2cnLFxuICAgICdhcHBsaWNhdGlvbi9vZ2cnLFxuICAgICdhdWRpby9vcHVzJyxcbiAgICAnYXVkaW8vd2F2JyxcbiAgICAnYXVkaW8vd2VibScsXG4gICAgJ2F1ZGlvLzNncHAyJyxcbl07XG5leHBvcnQgY29uc3QgVmlkZW9NaW1lVHlwZXMgPSBbXG4gICAgJ3ZpZGVvL3gtbXN2aWRlbycsXG4gICAgJ3ZpZGVvL21wZWcnLFxuICAgICd2aWRlby9vZ2cnLFxuICAgICd2aWRlby9tcDJ0JyxcbiAgICAndmlkZW8vd2VibScsXG4gICAgJ3ZpZGVvLzNncHAnLFxuICAgICd2aWRlby8zZ3BwMicsXG5dO1xuZXhwb3J0IGNvbnN0IEltYWdlTWltZVR5cGVzID0gW1xuICAgICdpbWFnZS9ibXAnLFxuICAgICdpbWFnZS9naWYnLFxuICAgICdpbWFnZS9qcGVnJyxcbiAgICAnaW1hZ2UvcG5nJyxcbiAgICAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgJ2ltYWdlL3ZuZC5taWNyb3NvZnQuaWNvbicsXG4gICAgJ2ltYWdlL3RpZmYnLFxuICAgICdpbWFnZS93ZWJwJyxcbl07XG5leHBvcnQgY29uc3QgQ29tcHJlc3NlZE1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24veC1iemlwJyxcbiAgICAnYXBwbGljYXRpb24veC1iemlwMicsXG4gICAgJ2FwcGxpY2F0aW9uL2d6aXAnLFxuICAgICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnLFxuICAgICdhcHBsaWNhdGlvbi94LXRhcicsXG4gICAgJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCcsXG5dO1xuZXhwb3J0IGNvbnN0IERvY3VtZW50TWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi94LWFiaXdvcmQnLFxuICAgICdhcHBsaWNhdGlvbi94LWZyZWVhcmMnLFxuICAgICdhcHBsaWNhdGlvbi92bmQuYW1hem9uLmVib29rJyxcbiAgICAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5yYXInLFxuICAgICdhcHBsaWNhdGlvbi9ydGYnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG5dO1xuZXhwb3J0IGNvbnN0IFRleHRNaW1lVHlwZXMgPSBbXG4gICAgJ3RleHQvY3NzJyxcbiAgICAndGV4dC9jc3YnLFxuICAgICd0ZXh0L2h0bWwnLFxuICAgICd0ZXh0L2NhbGVuZGFyJyxcbiAgICAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ2FwcGxpY2F0aW9uL2xkK2pzb24nLFxuICAgICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICd0ZXh0L3BsYWluJyxcbiAgICAnYXBwbGljYXRpb24veGh0bWwreG1sJyxcbiAgICAnYXBwbGljYXRpb24veG1sJyxcbiAgICAndGV4dC94bWwnLFxuXTtcbmV4cG9ydCBjb25zdCBCaW5hcnlEb2NzTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi9lcHViK3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3BkZicsXG5dO1xuZXhwb3J0IGNvbnN0IEZvbnRNaW1lVHlwZXMgPSBbXG4gICAgJ2ZvbnQvb3RmJyxcbiAgICAnZm9udC90dGYnLFxuICAgICdmb250L3dvZmYnLFxuICAgICdmb250L3dvZmYyJyxcbl07XG5leHBvcnQgY29uc3QgT3RoZXJNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgJ2FwcGxpY2F0aW9uL3gtY3NoJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLmFwcGxlLmluc3RhbGxlcit4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtc2gnLFxuICAgICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCcsXG4gICAgJ3ZuZC52aXNpbycsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tb3ppbGxhLnh1bCt4bWwnLFxuXTtcbmV4cG9ydCBjb25zdCBNaW1lVHlwZXMgPSBbXG4gICAgLi4uQXVkaW9NaW1lVHlwZXMsXG4gICAgLi4uVmlkZW9NaW1lVHlwZXMsXG4gICAgLi4uSW1hZ2VNaW1lVHlwZXMsXG4gICAgLi4uQ29tcHJlc3NlZE1pbWVUeXBlcyxcbiAgICAuLi5Eb2N1bWVudE1pbWVUeXBlcyxcbiAgICAuLi5UZXh0TWltZVR5cGVzLFxuICAgIC4uLkJpbmFyeURvY3NNaW1lVHlwZXMsXG4gICAgLi4uT3RoZXJNaW1lVHlwZXMsXG4gICAgLi4uRm9udE1pbWVUeXBlcyxcbiAgICAuLi5PdGhlck1pbWVUeXBlcyxcbl07XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEF1ZGlvTWltZVR5cGVzLCBJbWFnZU1pbWVUeXBlcyB9IGZyb20gJy4uL3R5cGVzL21pbWUtdHlwZXMudHlwZS5qcyc7XG5jb25zdCBTaW5nbGVGaWxlID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBuYW1lLCBwYXRoLCBtaW1lVHlwZSwgd2lkdGggfSA9IHByb3BzO1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtaW1lVHlwZSAmJiBJbWFnZU1pbWVUeXBlcy5pbmNsdWRlcyhtaW1lVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogcGF0aCwgc3R5bGU6IHsgbWF4SGVpZ2h0OiB3aWR0aCwgbWF4V2lkdGg6IHdpZHRoIH0sIGFsdDogbmFtZSB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbWVUeXBlICYmIEF1ZGlvTWltZVR5cGVzLmluY2x1ZGVzKG1pbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiwgeyBjb250cm9sczogdHJ1ZSwgc3JjOiBwYXRoIH0sXG4gICAgICAgICAgICAgICAgXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGVcIixcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcImF1ZGlvXCIpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0cmFja1wiLCB7IGtpbmQ6IFwiY2FwdGlvbnNcIiB9KSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGFzOiBcImFcIiwgaHJlZjogcGF0aCwgbWw6IFwiZGVmYXVsdFwiLCBzaXplOiBcInNtXCIsIHJvdW5kZWQ6IHRydWUsIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7IGljb246IFwiRG9jdW1lbnREb3dubG9hZFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBtcjogXCJkZWZhdWx0XCIgfSksXG4gICAgICAgICAgICBuYW1lKSkpO1xufTtcbmNvbnN0IEZpbGUgPSAoeyB3aWR0aCwgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgY29uc3QgeyBjdXN0b20gfSA9IHByb3BlcnR5O1xuICAgIGxldCBwYXRoID0gZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5KTtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5hbWUgPSBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLmZpbGVOYW1lUHJvcGVydHkgPyBjdXN0b20uZmlsZU5hbWVQcm9wZXJ0eSA6IGN1c3RvbS5rZXlQcm9wZXJ0eSk7XG4gICAgY29uc3QgbWltZVR5cGUgPSBjdXN0b20ubWltZVR5cGVQcm9wZXJ0eVxuICAgICAgICAmJiBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLm1pbWVUeXBlUHJvcGVydHkpO1xuICAgIGlmICghcHJvcGVydHkuY3VzdG9tLm11bHRpcGxlKSB7XG4gICAgICAgIGlmIChjdXN0b20ub3B0cyAmJiBjdXN0b20ub3B0cy5iYXNlVXJsKSB7XG4gICAgICAgICAgICBwYXRoID0gYCR7Y3VzdG9tLm9wdHMuYmFzZVVybH0vJHtuYW1lfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFNpbmdsZUZpbGUsIHsgcGF0aDogcGF0aCwgbmFtZTogbmFtZSwgd2lkdGg6IHdpZHRoLCBtaW1lVHlwZTogbWltZVR5cGUgfSkpO1xuICAgIH1cbiAgICBpZiAoY3VzdG9tLm9wdHMgJiYgY3VzdG9tLm9wdHMuYmFzZVVybCkge1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gY3VzdG9tLm9wdHMuYmFzZVVybCB8fCAnJztcbiAgICAgICAgcGF0aCA9IHBhdGgubWFwKChzaW5nbGVQYXRoLCBpbmRleCkgPT4gYCR7YmFzZVVybH0vJHtuYW1lW2luZGV4XX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBwYXRoLm1hcCgoc2luZ2xlUGF0aCwgaW5kZXgpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFNpbmdsZUZpbGUsIHsga2V5OiBzaW5nbGVQYXRoLCBwYXRoOiBzaW5nbGVQYXRoLCBuYW1lOiBuYW1lW2luZGV4XSwgd2lkdGg6IHdpZHRoLCBtaW1lVHlwZTogbWltZVR5cGVbaW5kZXhdIH0pKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBGaWxlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcyc7XG5jb25zdCBMaXN0ID0gKHByb3BzKSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlLCB7IHdpZHRoOiAxMDAsIC4uLnByb3BzIH0pKTtcbmV4cG9ydCBkZWZhdWx0IExpc3Q7XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcyc7XG5jb25zdCBTaG93ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBwcm9wZXJ0eSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVQcm9wZXJ0eSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCB0cmFuc2xhdGVQcm9wZXJ0eShwcm9wZXJ0eS5sYWJlbCwgcHJvcGVydHkucmVzb3VyY2VJZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGUsIHsgd2lkdGg6IFwiMTAwJVwiLCAuLi5wcm9wcyB9KSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNob3c7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBMb2dpbiBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBMb2dnZWRJbiBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9nZ2VkSW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2dlZEluID0gTG9nZ2VkSW5cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgU2NoZW1lVXBsb2FkIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVVcGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNjaGVtZVVwbG9hZCA9IFNjaGVtZVVwbG9hZFxuaW1wb3J0IFNjaGVtZVR5cGVTZWxlY3RFZGl0IGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2NoZW1lVHlwZVNlbGVjdEVkaXQgPSBTY2hlbWVUeXBlU2VsZWN0RWRpdFxuaW1wb3J0IEVycm9yTWVzc2FnZSBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRXJyb3JNZXNzYWdlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5FcnJvck1lc3NhZ2UgPSBFcnJvck1lc3NhZ2VcbmltcG9ydCBSZWNvcmREaWZmZXJlbmNlIGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL2NvbXBvbmVudHMvUmVjb3JkRGlmZmVyZW5jZSdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVjb3JkRGlmZmVyZW5jZSA9IFJlY29yZERpZmZlcmVuY2VcbmltcG9ydCBSZWNvcmRMaW5rIGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL2NvbXBvbmVudHMvUmVjb3JkTGluaydcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUmVjb3JkTGluayA9IFJlY29yZExpbmtcbmltcG9ydCBVcGxvYWRFZGl0Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRFZGl0Q29tcG9uZW50ID0gVXBsb2FkRWRpdENvbXBvbmVudFxuaW1wb3J0IFVwbG9hZExpc3RDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZExpc3RDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZExpc3RDb21wb25lbnQgPSBVcGxvYWRMaXN0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkU2hvd0NvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkU2hvd0NvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkU2hvd0NvbXBvbmVudCA9IFVwbG9hZFNob3dDb21wb25lbnQiXSwibmFtZXMiOlsiV3JhcHBlciIsInN0eWxlZCIsIkJveCIsIlN0eWxlZExvZ28iLCJpbWciLCJ0aGVtZUdldCIsIklsbHVzdHJhdGlvbnNXcmFwcGVyIiwiTG9naW4iLCJwcm9wcyIsIndpbmRvdyIsIl9fQVBQX1NUQVRFX18iLCJhY3Rpb24iLCJlcnJvck1lc3NhZ2UiLCJ0cmFuc2xhdGVDb21wb25lbnQiLCJ0cmFuc2xhdGVNZXNzYWdlIiwidXNlVHJhbnNsYXRpb24iLCJicmFuZGluZyIsInVzZVNlbGVjdG9yIiwic3RhdGUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJGcmFnbWVudCIsImZsZXgiLCJ2YXJpYW50IiwiYmciLCJoZWlnaHQiLCJib3hTaGFkb3ciLCJ3aWR0aCIsImNvbG9yIiwicCIsImZsZXhHcm93IiwiZGlzcGxheSIsInBvc2l0aW9uIiwiSDIiLCJmb250V2VpZ2h0IiwiVGV4dCIsIm10IiwibXIiLCJJbGx1c3RyYXRpb24iLCJ0b3AiLCJhcyIsIm1ldGhvZCIsIkg1IiwibWFyZ2luQm90dG9tIiwibG9nbyIsInNyYyIsImFsdCIsImNvbXBhbnlOYW1lIiwiTWVzc2FnZUJveCIsIm15IiwibWVzc2FnZSIsInNwbGl0IiwibGVuZ3RoIiwiRm9ybUdyb3VwIiwiTGFiZWwiLCJyZXF1aXJlZCIsIklucHV0IiwibmFtZSIsInBsYWNlaG9sZGVyIiwidHlwZSIsImF1dG9Db21wbGV0ZSIsInRleHRBbGlnbiIsIkJ1dHRvbiIsIndpdGhNYWRlV2l0aExvdmUiLCJNYWRlV2l0aExvdmUiLCJMb2dnZWRJbiIsInNlc3Npb24iLCJwYXRocyIsInRyYW5zbGF0ZUJ1dHRvbiIsImRyb3BBY3Rpb25zIiwibGFiZWwiLCJvbkNsaWNrIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImxvY2F0aW9uIiwiaHJlZiIsImlkIiwiaWNvbiIsImxvZ291dFBhdGgiLCJmbGV4U2hyaW5rIiwiQ3VycmVudFVzZXJOYXYiLCJlbWFpbCIsInRpdGxlIiwiYXZhdGFyVXJsIiwiRGFzaGJvYXJkIiwiSDEiLCJTY2hlbWVVcGxvYWQiLCJvbkNoYW5nZSIsInByb3BlcnR5IiwicmVjb3JkIiwiXyIsInNldEZpbGUiLCJ1c2VTdGF0ZSIsInNjaGVtZVNpemUiLCJwYXJhbXMiLCJzY2hlbWVfc2l6ZSIsInNjaGVtZVZlcnNpb24iLCJEYXRlIiwic2NoZW1lX3ZlcnNpb24iLCJ0b0xvY2FsZVN0cmluZyIsImRhdGVTdHlsZSIsInRpbWVTdHlsZSIsInRtIiwiaGFuZGxlRHJvcCIsImZpbGVzIiwiZXJyb3IiLCJlcnJvcnMiLCJwYXRoIiwiQm9vbGVhbiIsInN0eWxlIiwianVzdGlmeUNvbnRlbnQiLCJQcm9wZXJ0eUxhYmVsIiwiRHJvcFpvbmUiLCJEcm9wWm9uZUl0ZW0iLCJmaWxlbmFtZSIsIkZvcm1NZXNzYWdlIiwicmVzb3VyY2VJZCIsIlNjaGVtZVR5cGVTZWxlY3RFZGl0IiwiYXZhaWxhYmxlVmFsdWVzIiwicHJvcFZhbHVlIiwidmFsdWUiLCJtYXAiLCJ2IiwiZGVmYXVsdFZhbHVlIiwic2VsZWN0ZWQiLCJmaW5kIiwiYXYiLCJvcGFjaXR5IiwiU2VsZWN0Iiwib3B0aW9ucyIsInMiLCJpc0Rpc2FibGVkIiwiRXJyb3JNZXNzYWdlIiwiVGFibGVDZWxsIiwiVGFibGVSb3ciLCJUYWJsZUhlYWQiLCJBZG1pblRhYmxlIiwiZmxhdCIsIlRhYmxlQm9keSIsIlZpZXdIZWxwZXJzIiwiTGluayIsInVzZUVmZmVjdCIsIkljb24iLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJSZWNvcmREaWZmZXJlbmNlIiwiUmVjb3JkTGluayIsIlVwbG9hZEVkaXRDb21wb25lbnQiLCJVcGxvYWRMaXN0Q29tcG9uZW50IiwiVXBsb2FkU2hvd0NvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUtBLE1BQU1BLE9BQU8sR0FBR0MsdUJBQU0sQ0FBQ0MsZ0JBQUcsQ0FBRTtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7RUFDRCxNQUFNQyxVQUFVLEdBQUdGLHVCQUFNLENBQUNHLEdBQUk7QUFDOUI7QUFDQSxVQUFBLEVBQVlDLHFCQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ25DLENBQUM7RUFDRCxNQUFNQyxvQkFBb0IsR0FBR0wsdUJBQU0sQ0FBQ0MsZ0JBQUcsQ0FBRTtBQUN6QztBQUNBO0FB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
