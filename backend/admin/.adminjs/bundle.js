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
  AdminJS.UserComponents.Dashboard = Dashboard;
  AdminJS.UserComponents.SchemeUpload = SchemeUpload;
  AdminJS.UserComponents.SchemeTypeSelectEdit = SchemeTypeSelectEdit;
  AdminJS.UserComponents.RecordDifference = RecordDifference;
  AdminJS.UserComponents.RecordLink = RecordLink;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;

})(React, ReactRedux, AdminJSDesignSystem, styled, AdminJS);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4uanMiLCIuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvRGFzaGJvYXJkLmpzIiwiLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL1NjaGVtZVVwbG9hZC5qcyIsIi4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL2NvbXBvbmVudHMvUmVjb3JkRGlmZmVyZW5jZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL3V0aWxzL2dldC1sb2ctcHJvcGVydHktbmFtZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy9sb2dnZXIvbGliL2NvbXBvbmVudHMvUmVjb3JkTGluay5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRFZGl0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS90eXBlcy9taW1lLXR5cGVzLnR5cGUuanMiLCIuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvZmlsZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRMaXN0Q29tcG9uZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZFNob3dDb21wb25lbnQuanMiLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlU2VsZWN0b3IgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBCb3gsIEg1LCBIMiwgTGFiZWwsIElsbHVzdHJhdGlvbiwgSW5wdXQsIEZvcm1Hcm91cCwgQnV0dG9uLCBUZXh0LCBNZXNzYWdlQm94LCBNYWRlV2l0aExvdmUsIHRoZW1lR2V0LCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50cyc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuY29uc3QgV3JhcHBlciA9IHN0eWxlZChCb3gpIGBcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogMTAwJTtcbmA7XG5jb25zdCBTdHlsZWRMb2dvID0gc3R5bGVkLmltZyBgXG4gIG1heC13aWR0aDogMjAwcHg7XG4gIG1hcmdpbjogJHt0aGVtZUdldCgnc3BhY2UnLCAnbWQnKX0gMDtcbmA7XG5jb25zdCBJbGx1c3RyYXRpb25zV3JhcHBlciA9IHN0eWxlZChCb3gpIGBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgJiBzdmcgW3N0cm9rZT0nIzNCMzU1MiddIHtcbiAgICBzdHJva2U6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KTtcbiAgfVxuICAmIHN2ZyBbZmlsbD0nIzMwNDBENiddIHtcbiAgICBmaWxsOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDEpO1xuICB9XG5gO1xuZXhwb3J0IGNvbnN0IExvZ2luID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb3BzID0gd2luZG93Ll9fQVBQX1NUQVRFX187XG4gICAgY29uc3QgeyBhY3Rpb24sIGVycm9yTWVzc2FnZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVDb21wb25lbnQsIHRyYW5zbGF0ZU1lc3NhZ2UgfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgYnJhbmRpbmcgPSB1c2VTZWxlY3Rvcigoc3RhdGUpID0+IHN0YXRlLmJyYW5kaW5nKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoV3JhcHBlciwgeyBmbGV4OiB0cnVlLCB2YXJpYW50OiBcImdyZXlcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwid2hpdGVcIiwgaGVpZ2h0OiBcIjQ4MHB4XCIsIGZsZXg6IHRydWUsIGJveFNoYWRvdzogXCJsb2dpblwiLCB3aWR0aDogWzEsIDIgLyAzLCAnYXV0byddIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYmc6IFwicHJpbWFyeTEwMFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBwOiBcIngzXCIsIHdpZHRoOiBcIjM4MHB4XCIsIGZsZXhHcm93OiAwLCBkaXNwbGF5OiBbJ25vbmUnLCAnbm9uZScsICdibG9jayddLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDIsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChUZXh0LCB7IGZvbnRXZWlnaHQ6IFwibGlnaHRlclwiLCBtdDogXCJkZWZhdWx0XCIgfSwgXCJXZWxjb21lIHRvIHRoZSBHRU5UUkFJTiBhZG1pbiBwYW5lbC5cIiksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSWxsdXN0cmF0aW9uc1dyYXBwZXIsIHsgcDogXCJ4eGxcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgbXI6IFwiZGVmYXVsdFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbGx1c3RyYXRpb24sIHsgdmFyaWFudDogXCJQbGFuZXRcIiwgd2lkdGg6IDgyLCBoZWlnaHQ6IDkxIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGRpc3BsYXk6IFwiaW5saW5lXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkFzdHJvbmF1dFwiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgZGlzcGxheTogXCJpbmxpbmVcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgdG9wOiBcIi0yMHB4XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KElsbHVzdHJhdGlvbiwgeyB2YXJpYW50OiBcIkZsYWdJbkNvZ1wiLCB3aWR0aDogODIsIGhlaWdodDogOTEgfSkpKSksXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgYXM6IFwiZm9ybVwiLCBhY3Rpb246IGFjdGlvbiwgbWV0aG9kOiBcIlBPU1RcIiwgcDogXCJ4M1wiLCBmbGV4R3JvdzogMSwgd2lkdGg6IFsnMTAwJScsICcxMDAlJywgJzQ4MHB4J10gfSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChINSwgeyBtYXJnaW5Cb3R0b206IFwieHhsXCIgfSwgYnJhbmRpbmcubG9nbyA/IFJlYWN0LmNyZWF0ZUVsZW1lbnQoU3R5bGVkTG9nbywgeyBzcmM6IGJyYW5kaW5nLmxvZ28sIGFsdDogYnJhbmRpbmcuY29tcGFueU5hbWUgfSkgOiBicmFuZGluZy5jb21wYW55TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChNZXNzYWdlQm94LCB7IG15OiBcImxnXCIsIG1lc3NhZ2U6IGVycm9yTWVzc2FnZS5zcGxpdCgnICcpLmxlbmd0aCA+IDEgPyBlcnJvck1lc3NhZ2UgOiAnV3JvbmcgdXNlcm5hbWUgYW5kL29yIHBhc3N3b3JkJywgdmFyaWFudDogXCJkYW5nZXJcIiB9KSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgeyByZXF1aXJlZDogdHJ1ZSB9LCBcIlVzZXJuYW1lXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyBuYW1lOiBcImVtYWlsXCIsIHBsYWNlaG9sZGVyOiBcIlVzZXJuYW1lXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIHsgcmVxdWlyZWQ6IHRydWUgfSwgdHJhbnNsYXRlQ29tcG9uZW50KCdMb2dpbi5wcm9wZXJ0aWVzLnBhc3N3b3JkJykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJbnB1dCwgeyB0eXBlOiBcInBhc3N3b3JkXCIsIG5hbWU6IFwicGFzc3dvcmRcIiwgcGxhY2Vob2xkZXI6IHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ucHJvcGVydGllcy5wYXNzd29yZCcpLCBhdXRvQ29tcGxldGU6IFwibmV3LXBhc3N3b3JkXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRleHQsIHsgbXQ6IFwieGxcIiwgdGV4dEFsaWduOiBcImNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEJ1dHRvbiwgeyB2YXJpYW50OiBcImNvbnRhaW5lZFwiIH0sIHRyYW5zbGF0ZUNvbXBvbmVudCgnTG9naW4ubG9naW5CdXR0b24nKSkpKSksXG4gICAgICAgICAgICBicmFuZGluZy53aXRoTWFkZVdpdGhMb3ZlID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IG10OiBcInh4bFwiIH0sXG4gICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChNYWRlV2l0aExvdmUsIG51bGwpKSkgOiBudWxsKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IExvZ2luO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgSDEsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmNvbnN0IERhc2hib2FyZCA9ICgpID0+IHtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwiZ3JleVwiIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IHZhcmlhbnQ6IFwid2hpdGVcIiwgcDogXCJ4bFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSDEsIHsgZm9udFdlaWdodDogXCJsaWdodGVyXCIgfSwgXCJHRU5UUkFJTiBBZG1pblwiKSxcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoVGV4dCwgeyBmb250V2VpZ2h0OiBcImxpZ2h0ZXJcIiwgbXQ6IFwiZGVmYXVsdFwiIH0sIFwiV2VsY29tZSB0byB0aGUgR0VOVFJBSU4gYWRtaW4gcGFuZWwuIEhlcmUgeW91IGNhbiBtYW5hZ2UgdGhlIHBhdGhvZ2VuIGRhdGFiYXNlLCBjcmVhdGUgdXNlcnMgZm9yIHRoZSBhZG1pbiBwYW5lbCBhbmQgYXNzaWduIHVzZXIgcm9sZXMuIFVzZSB0aGUgbmF2aWdhdGlvbiBvbiB0aGUgbGVmdCBzaWRlYmFyIHRvIGFjY2VzcyBkaWZmZXJlbnQgc2VjdGlvbnMuXCIpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IERhc2hib2FyZDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJveCwgRHJvcFpvbmUsIERyb3Bab25lSXRlbSwgRm9ybUdyb3VwLCBGb3JtTWVzc2FnZSB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgUHJvcGVydHlMYWJlbCwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmNvbnN0IFNjaGVtZVVwbG9hZCA9IChwcm9wcykgPT4ge1xuICAgIGNvbnN0IHsgb25DaGFuZ2UsIHByb3BlcnR5LCByZWNvcmQgfSA9IHByb3BzO1xuICAgIGNvbnN0IFtfLCBzZXRGaWxlXSA9IHVzZVN0YXRlKG51bGwpO1xuICAgIGNvbnN0IHNjaGVtZVNpemUgPSByZWNvcmQucGFyYW1zLnNjaGVtZV9zaXplO1xuICAgIGNvbnN0IHNjaGVtZVZlcnNpb24gPSBuZXcgRGF0ZShyZWNvcmQucGFyYW1zLnNjaGVtZV92ZXJzaW9uKS50b0xvY2FsZVN0cmluZygnZGUtREUnLCB7XG4gICAgICAgIGRhdGVTdHlsZTogJ3Nob3J0JyxcbiAgICAgICAgdGltZVN0eWxlOiAnc2hvcnQnLFxuICAgIH0pO1xuICAgIGNvbnN0IHsgdG0gfSA9IHVzZVRyYW5zbGF0aW9uKCk7XG4gICAgY29uc3QgaGFuZGxlRHJvcCA9IChmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2V0RmlsZShmaWxlc1swXSk7XG4gICAgICAgICAgICBvbkNoYW5nZShwcm9wZXJ0eS5uYW1lLCBmaWxlc1swXSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGVycm9yID0gcmVjb3JkLmVycm9ycz8uW3Byb3BlcnR5LnBhdGhdO1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIHsgZXJyb3I6IEJvb2xlYW4oZXJyb3IpIH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQm94LCB7IGZsZXg6IHRydWUsIHN0eWxlOiB7IGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQcm9wZXJ0eUxhYmVsLCB7IHByb3BlcnR5OiBwcm9wZXJ0eSB9KSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmUsIHsgb25DaGFuZ2U6IGhhbmRsZURyb3AgfSksXG4gICAgICAgIHNjaGVtZVZlcnNpb24gJiYgc2NoZW1lU2l6ZSAmJiAoUmVhY3QuY3JlYXRlRWxlbWVudChEcm9wWm9uZUl0ZW0sIHsgZmlsZW5hbWU6IGBWZXJzaW9uOiA8JHtzY2hlbWVWZXJzaW9ufT4sIFNpemU6ICR7c2NoZW1lU2l6ZX0gTUJgLCBzcmM6ICd0ZXN0JyB9KSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybU1lc3NhZ2UsIG51bGwsIGVycm9yICYmIHRtKGVycm9yLm1lc3NhZ2UsIHByb3BlcnR5LnJlc291cmNlSWQpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtZVVwbG9hZDtcbiIsImltcG9ydCB7IFByb3BlcnR5TGFiZWwsIHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQm94LCBGb3JtR3JvdXAsIEZvcm1NZXNzYWdlLCBTZWxlY3QgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmNvbnN0IFNjaGVtZVR5cGVTZWxlY3RFZGl0ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyByZWNvcmQsIHByb3BlcnR5LCBvbkNoYW5nZSB9ID0gcHJvcHM7XG4gICAgY29uc3QgZXJyb3IgPSByZWNvcmQuZXJyb3JzPy5bcHJvcGVydHkucGF0aF07XG4gICAgY29uc3QgeyB0bSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICBpZiAoIXByb3BlcnR5LmF2YWlsYWJsZVZhbHVlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcHJvcFZhbHVlID0gcmVjb3JkLnBhcmFtcz8uW3Byb3BlcnR5LnBhdGhdID8/IHByb3BlcnR5LnByb3BzLnZhbHVlID8/ICcnO1xuICAgIGNvbnN0IGF2YWlsYWJsZVZhbHVlcyA9IHByb3BlcnR5LmF2YWlsYWJsZVZhbHVlcy5tYXAoKHYpID0+ICh7XG4gICAgICAgIC4uLnYsXG4gICAgICAgIGxhYmVsOiB0bShgJHtwcm9wZXJ0eS5wYXRofS4ke3YudmFsdWV9YCwgcHJvcGVydHkucmVzb3VyY2VJZCwgeyBkZWZhdWx0VmFsdWU6IHYubGFiZWwgPz8gdi52YWx1ZSB9KSxcbiAgICB9KSk7XG4gICAgY29uc3Qgc2VsZWN0ZWQgPSBhdmFpbGFibGVWYWx1ZXMuZmluZCgoYXYpID0+IGF2LnZhbHVlID09IHByb3BWYWx1ZSk7XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBlcnJvcjogQm9vbGVhbihlcnJvcikgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChQcm9wZXJ0eUxhYmVsLCB7IHByb3BlcnR5OiBwcm9wZXJ0eSB9KSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIHsgc3R5bGU6IHsgb3BhY2l0eTogcmVjb3JkLnBhcmFtcy5pZCA/IDAuNSA6IDEgfSB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWxlY3QsIHsgdmFsdWU6IHNlbGVjdGVkLCBvcHRpb25zOiBhdmFpbGFibGVWYWx1ZXMsIG9uQ2hhbmdlOiAocykgPT4gb25DaGFuZ2UocHJvcGVydHkucGF0aCwgcz8udmFsdWUgPz8gJycpLCBpc0Rpc2FibGVkOiByZWNvcmQucGFyYW1zLmlkID8gdHJ1ZSA6IGZhbHNlLCAuLi5wcm9wZXJ0eS5wcm9wcyB9KSxcbiAgICAgICAgICAgICcgJyksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybU1lc3NhZ2UsIG51bGwsIGVycm9yICYmIHRtKGVycm9yLm1lc3NhZ2UsIHByb3BlcnR5LnJlc291cmNlSWQpKSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNjaGVtZVR5cGVTZWxlY3RFZGl0O1xuIiwiaW1wb3J0IHsgRm9ybUdyb3VwLCBMYWJlbCwgVGFibGUgYXMgQWRtaW5UYWJsZSwgVGFibGVCb2R5LCBUYWJsZUNlbGwsIFRhYmxlSGVhZCwgVGFibGVSb3csIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyBmbGF0IH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgc3R5bGVkIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbS9zdHlsZWQtY29tcG9uZW50cyc7XG5jb25zdCBDZWxsID0gc3R5bGVkKFRhYmxlQ2VsbCkgYFxuICB3aWR0aDogMTAwJTtcbiAgd29yZC1icmVhazogYnJlYWstd29yZDtcbmA7XG5jb25zdCBSb3cgPSBzdHlsZWQoVGFibGVSb3cpIGBcbiAgZGlzcGxheTogZmxleDtcbiAgcG9zaXRpb246IHVuc2V0O1xuYDtcbmNvbnN0IEhlYWQgPSBzdHlsZWQoVGFibGVIZWFkKSBgXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHBvc2l0aW9uOiB1bnNldDtcbmA7XG5jb25zdCBUYWJsZSA9IHN0eWxlZChBZG1pblRhYmxlKSBgXG4gIHdpZHRoOiAxMDAlO1xuICBwb3NpdGlvbjogdW5zZXQ7XG4gIGRpc3BsYXk6IGJsb2NrO1xuYDtcbmNvbnN0IFJlY29yZERpZmZlcmVuY2UgPSAoeyByZWNvcmQsIHByb3BlcnR5IH0pID0+IHtcbiAgICBjb25zdCBkaWZmZXJlbmNlcyA9IEpTT04ucGFyc2UoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgICBmbGF0LnVuZmxhdHRlbihyZWNvcmQ/LnBhcmFtcyA/PyB7fSk/Lltwcm9wZXJ0eS5uYW1lXSA/PyB7fSk7XG4gICAgaWYgKCFkaWZmZXJlbmNlcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgbnVsbCxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChMYWJlbCwgbnVsbCwgcHJvcGVydHkubGFiZWwpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlLCBudWxsLFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIZWFkLCBudWxsLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm93LCBudWxsLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIG51bGwsIFwiUHJvcGVydHkgbmFtZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCBudWxsLCBcIkJlZm9yZVwiKSxcbiAgICAgICAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDZWxsLCBudWxsLCBcIkFmdGVyXCIpKSksXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFRhYmxlQm9keSwgbnVsbCwgT2JqZWN0LmVudHJpZXMoZGlmZmVyZW5jZXMpLm1hcCgoW3Byb3BlcnR5TmFtZSwgeyBiZWZvcmUsIGFmdGVyIH1dKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJvdywgeyBrZXk6IHByb3BlcnR5TmFtZSB9LFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIHsgd2lkdGg6IDEgLyAzIH0sIHByb3BlcnR5TmFtZSksXG4gICAgICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2VsbCwgeyBjb2xvcjogXCJyZWRcIiwgd2lkdGg6IDEgLyAzIH0sIEpTT04uc3RyaW5naWZ5KGJlZm9yZSkgfHwgJ3VuZGVmaW5lZCcpLFxuICAgICAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENlbGwsIHsgY29sb3I6IFwiZ3JlZW5cIiwgd2lkdGg6IDEgLyAzIH0sIEpTT04uc3RyaW5naWZ5KGFmdGVyKSB8fCAndW5kZWZpbmVkJykpKTtcbiAgICAgICAgICAgIH0pKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBSZWNvcmREaWZmZXJlbmNlO1xuIiwiZXhwb3J0IGNvbnN0IGdldExvZ1Byb3BlcnR5TmFtZSA9IChwcm9wZXJ0eSwgbWFwcGluZyA9IHt9KSA9PiB7XG4gICAgaWYgKCFtYXBwaW5nW3Byb3BlcnR5XSkge1xuICAgICAgICByZXR1cm4gcHJvcGVydHk7XG4gICAgfVxuICAgIHJldHVybiBtYXBwaW5nW3Byb3BlcnR5XTtcbn07XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExpbmsgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbmltcG9ydCB7IFZpZXdIZWxwZXJzIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZ2V0TG9nUHJvcGVydHlOYW1lIH0gZnJvbSAnLi4vdXRpbHMvZ2V0LWxvZy1wcm9wZXJ0eS1uYW1lLmpzJztcbmNvbnN0IHZpZXdIZWxwZXJzID0gbmV3IFZpZXdIZWxwZXJzKCk7XG5jb25zdCBSZWNvcmRMaW5rID0gKHsgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgaWYgKCFyZWNvcmQ/LnBhcmFtcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgeyBjdXN0b20gPSB7fSB9ID0gcHJvcGVydHk7XG4gICAgY29uc3QgeyBwcm9wZXJ0aWVzTWFwcGluZyA9IHt9IH0gPSBjdXN0b207XG4gICAgY29uc3QgcmVjb3JkSWRQYXJhbSA9IGdldExvZ1Byb3BlcnR5TmFtZSgncmVjb3JkSWQnLCBwcm9wZXJ0aWVzTWFwcGluZyk7XG4gICAgY29uc3QgcmVzb3VyY2VJZFBhcmFtID0gZ2V0TG9nUHJvcGVydHlOYW1lKCdyZXNvdXJjZScsIHByb3BlcnRpZXNNYXBwaW5nKTtcbiAgICBjb25zdCByZWNvcmRUaXRsZVBhcmFtID0gZ2V0TG9nUHJvcGVydHlOYW1lKCdyZWNvcmRUaXRsZScsIHByb3BlcnRpZXNNYXBwaW5nKTtcbiAgICBjb25zdCByZWNvcmRJZCA9IHJlY29yZC5wYXJhbXNbcmVjb3JkSWRQYXJhbV07XG4gICAgY29uc3QgcmVzb3VyY2UgPSByZWNvcmQucGFyYW1zW3Jlc291cmNlSWRQYXJhbV07XG4gICAgY29uc3QgcmVjb3JkVGl0bGUgPSByZWNvcmQucGFyYW1zW3JlY29yZFRpdGxlUGFyYW1dO1xuICAgIGlmICghcmVjb3JkSWQgfHwgIXJlc291cmNlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHsgaHJlZjogdmlld0hlbHBlcnMucmVjb3JkQWN0aW9uVXJsKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnc2hvdycsXG4gICAgICAgICAgICAgICAgcmVjb3JkSWQsXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VJZDogcmVzb3VyY2UsXG4gICAgICAgICAgICB9KSB9LCByZWNvcmRUaXRsZSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBSZWNvcmRMaW5rO1xuIiwiaW1wb3J0IHsgRHJvcFpvbmUsIERyb3Bab25lSXRlbSwgRm9ybUdyb3VwLCBMYWJlbCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCwgdXNlVHJhbnNsYXRpb24gfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuY29uc3QgRWRpdCA9ICh7IHByb3BlcnR5LCByZWNvcmQsIG9uQ2hhbmdlIH0pID0+IHtcbiAgICBjb25zdCB7IHRyYW5zbGF0ZVByb3BlcnR5IH0gPSB1c2VUcmFuc2xhdGlvbigpO1xuICAgIGNvbnN0IHsgcGFyYW1zIH0gPSByZWNvcmQ7XG4gICAgY29uc3QgeyBjdXN0b20gfSA9IHByb3BlcnR5O1xuICAgIGNvbnN0IHBhdGggPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5KTtcbiAgICBjb25zdCBrZXkgPSBmbGF0LmdldChwYXJhbXMsIGN1c3RvbS5rZXlQcm9wZXJ0eSk7XG4gICAgY29uc3QgZmlsZSA9IGZsYXQuZ2V0KHBhcmFtcywgY3VzdG9tLmZpbGVQcm9wZXJ0eSk7XG4gICAgY29uc3QgW29yaWdpbmFsS2V5LCBzZXRPcmlnaW5hbEtleV0gPSB1c2VTdGF0ZShrZXkpO1xuICAgIGNvbnN0IFtmaWxlc1RvVXBsb2FkLCBzZXRGaWxlc1RvVXBsb2FkXSA9IHVzZVN0YXRlKFtdKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICAvLyBpdCBtZWFucyBtZWFucyB0aGF0IHNvbWVvbmUgaGl0IHNhdmUgYW5kIG5ldyBmaWxlIGhhcyBiZWVuIHVwbG9hZGVkXG4gICAgICAgIC8vIGluIHRoaXMgY2FzZSBmbGllc1RvVXBsb2FkIHNob3VsZCBiZSBjbGVhcmVkLlxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMgd2hlbiB1c2VyIHR1cm5zIG9mZiByZWRpcmVjdCBhZnRlciBuZXcvZWRpdFxuICAgICAgICBpZiAoKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnICYmIGtleSAhPT0gb3JpZ2luYWxLZXkpXG4gICAgICAgICAgICB8fCAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycgJiYgIW9yaWdpbmFsS2V5KVxuICAgICAgICAgICAgfHwgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnICYmIEFycmF5LmlzQXJyYXkoa2V5KSAmJiBrZXkubGVuZ3RoICE9PSBvcmlnaW5hbEtleS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBzZXRPcmlnaW5hbEtleShrZXkpO1xuICAgICAgICAgICAgc2V0RmlsZXNUb1VwbG9hZChbXSk7XG4gICAgICAgIH1cbiAgICB9LCBba2V5LCBvcmlnaW5hbEtleV0pO1xuICAgIGNvbnN0IG9uVXBsb2FkID0gKGZpbGVzKSA9PiB7XG4gICAgICAgIHNldEZpbGVzVG9VcGxvYWQoZmlsZXMpO1xuICAgICAgICBvbkNoYW5nZShjdXN0b20uZmlsZVByb3BlcnR5LCBmaWxlcyk7XG4gICAgfTtcbiAgICBjb25zdCBoYW5kbGVSZW1vdmUgPSAoKSA9PiB7XG4gICAgICAgIG9uQ2hhbmdlKGN1c3RvbS5maWxlUHJvcGVydHksIG51bGwpO1xuICAgIH07XG4gICAgY29uc3QgaGFuZGxlTXVsdGlSZW1vdmUgPSAoc2luZ2xlS2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gKGZsYXQuZ2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5rZXlQcm9wZXJ0eSkgfHwgW10pLmluZGV4T2Yoc2luZ2xlS2V5KTtcbiAgICAgICAgY29uc3QgZmlsZXNUb0RlbGV0ZSA9IGZsYXQuZ2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5maWxlc1RvRGVsZXRlUHJvcGVydHkpIHx8IFtdO1xuICAgICAgICBpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLm1hcCgoY3VycmVudFBhdGgsIGkpID0+IChpICE9PSBpbmRleCA/IGN1cnJlbnRQYXRoIDogbnVsbCkpO1xuICAgICAgICAgICAgbGV0IG5ld1BhcmFtcyA9IGZsYXQuc2V0KHJlY29yZC5wYXJhbXMsIGN1c3RvbS5maWxlc1RvRGVsZXRlUHJvcGVydHksIFsuLi5maWxlc1RvRGVsZXRlLCBpbmRleF0pO1xuICAgICAgICAgICAgbmV3UGFyYW1zID0gZmxhdC5zZXQobmV3UGFyYW1zLCBjdXN0b20uZmlsZVBhdGhQcm9wZXJ0eSwgbmV3UGF0aCk7XG4gICAgICAgICAgICBvbkNoYW5nZSh7XG4gICAgICAgICAgICAgICAgLi4ucmVjb3JkLFxuICAgICAgICAgICAgICAgIHBhcmFtczogbmV3UGFyYW1zLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjYW5ub3QgcmVtb3ZlIGZpbGUgd2hlbiB0aGVyZSBhcmUgbm8gdXBsb2FkZWQgZmlsZXMgeWV0Jyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChGb3JtR3JvdXAsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTGFiZWwsIG51bGwsIHRyYW5zbGF0ZVByb3BlcnR5KHByb3BlcnR5LmxhYmVsLCBwcm9wZXJ0eS5yZXNvdXJjZUlkKSksXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmUsIHsgb25DaGFuZ2U6IG9uVXBsb2FkLCBtdWx0aXBsZTogY3VzdG9tLm11bHRpcGxlLCB2YWxpZGF0ZToge1xuICAgICAgICAgICAgICAgIG1pbWVUeXBlczogY3VzdG9tLm1pbWVUeXBlcyxcbiAgICAgICAgICAgICAgICBtYXhTaXplOiBjdXN0b20ubWF4U2l6ZSxcbiAgICAgICAgICAgIH0sIGZpbGVzOiBmaWxlc1RvVXBsb2FkIH0pLFxuICAgICAgICAhY3VzdG9tLm11bHRpcGxlICYmIGtleSAmJiBwYXRoICYmICFmaWxlc1RvVXBsb2FkLmxlbmd0aCAmJiBmaWxlICE9PSBudWxsICYmIChSZWFjdC5jcmVhdGVFbGVtZW50KERyb3Bab25lSXRlbSwgeyBmaWxlbmFtZToga2V5LCBzcmM6IHBhdGgsIG9uUmVtb3ZlOiBoYW5kbGVSZW1vdmUgfSkpLFxuICAgICAgICBjdXN0b20ubXVsdGlwbGUgJiYga2V5ICYmIGtleS5sZW5ndGggJiYgcGF0aCA/IChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBrZXkubWFwKChzaW5nbGVLZXksIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAvLyB3aGVuIHdlIHJlbW92ZSBpdGVtcyB3ZSBzZXQgb25seSBwYXRoIGluZGV4IHRvIG51bGxzLlxuICAgICAgICAgICAgLy8ga2V5IGlzIHN0aWxsIHRoZXJlLiBUaGlzIGlzIGJlY2F1c2VcbiAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gbWFpbnRhaW4gYWxsIHRoZSBpbmRleGVzLiBTbyBoZXJlIHdlIHNpbXBseSBmaWx0ZXIgb3V0IGVsZW1lbnRzIHdoaWNoXG4gICAgICAgICAgICAvLyB3ZXJlIHJlbW92ZWQgYW5kIGRpc3BsYXkgb25seSB3aGF0IHdhcyBsZWZ0XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UGF0aCA9IHBhdGhbaW5kZXhdO1xuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRQYXRoID8gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRHJvcFpvbmVJdGVtLCB7IGtleTogc2luZ2xlS2V5LCBmaWxlbmFtZTogc2luZ2xlS2V5LCBzcmM6IHBhdGhbaW5kZXhdLCBvblJlbW92ZTogKCkgPT4gaGFuZGxlTXVsdGlSZW1vdmUoc2luZ2xlS2V5KSB9KSkgOiAnJztcbiAgICAgICAgfSkpKSA6ICcnKSk7XG59O1xuZXhwb3J0IGRlZmF1bHQgRWRpdDtcbiIsImV4cG9ydCBjb25zdCBBdWRpb01pbWVUeXBlcyA9IFtcbiAgICAnYXVkaW8vYWFjJyxcbiAgICAnYXVkaW8vbWlkaScsXG4gICAgJ2F1ZGlvL3gtbWlkaScsXG4gICAgJ2F1ZGlvL21wZWcnLFxuICAgICdhdWRpby9vZ2cnLFxuICAgICdhcHBsaWNhdGlvbi9vZ2cnLFxuICAgICdhdWRpby9vcHVzJyxcbiAgICAnYXVkaW8vd2F2JyxcbiAgICAnYXVkaW8vd2VibScsXG4gICAgJ2F1ZGlvLzNncHAyJyxcbl07XG5leHBvcnQgY29uc3QgVmlkZW9NaW1lVHlwZXMgPSBbXG4gICAgJ3ZpZGVvL3gtbXN2aWRlbycsXG4gICAgJ3ZpZGVvL21wZWcnLFxuICAgICd2aWRlby9vZ2cnLFxuICAgICd2aWRlby9tcDJ0JyxcbiAgICAndmlkZW8vd2VibScsXG4gICAgJ3ZpZGVvLzNncHAnLFxuICAgICd2aWRlby8zZ3BwMicsXG5dO1xuZXhwb3J0IGNvbnN0IEltYWdlTWltZVR5cGVzID0gW1xuICAgICdpbWFnZS9ibXAnLFxuICAgICdpbWFnZS9naWYnLFxuICAgICdpbWFnZS9qcGVnJyxcbiAgICAnaW1hZ2UvcG5nJyxcbiAgICAnaW1hZ2Uvc3ZnK3htbCcsXG4gICAgJ2ltYWdlL3ZuZC5taWNyb3NvZnQuaWNvbicsXG4gICAgJ2ltYWdlL3RpZmYnLFxuICAgICdpbWFnZS93ZWJwJyxcbl07XG5leHBvcnQgY29uc3QgQ29tcHJlc3NlZE1pbWVUeXBlcyA9IFtcbiAgICAnYXBwbGljYXRpb24veC1iemlwJyxcbiAgICAnYXBwbGljYXRpb24veC1iemlwMicsXG4gICAgJ2FwcGxpY2F0aW9uL2d6aXAnLFxuICAgICdhcHBsaWNhdGlvbi9qYXZhLWFyY2hpdmUnLFxuICAgICdhcHBsaWNhdGlvbi94LXRhcicsXG4gICAgJ2FwcGxpY2F0aW9uL3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtN3otY29tcHJlc3NlZCcsXG5dO1xuZXhwb3J0IGNvbnN0IERvY3VtZW50TWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi94LWFiaXdvcmQnLFxuICAgICdhcHBsaWNhdGlvbi94LWZyZWVhcmMnLFxuICAgICdhcHBsaWNhdGlvbi92bmQuYW1hem9uLmVib29rJyxcbiAgICAnYXBwbGljYXRpb24vbXN3b3JkJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LndvcmRwcm9jZXNzaW5nbWwuZG9jdW1lbnQnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtZm9udG9iamVjdCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQucHJlc2VudGF0aW9uJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9hc2lzLm9wZW5kb2N1bWVudC5zcHJlYWRzaGVldCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5vYXNpcy5vcGVuZG9jdW1lbnQudGV4dCcsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JyxcbiAgICAnYXBwbGljYXRpb24vdm5kLm9wZW54bWxmb3JtYXRzLW9mZmljZWRvY3VtZW50LnByZXNlbnRhdGlvbm1sLnByZXNlbnRhdGlvbicsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5yYXInLFxuICAgICdhcHBsaWNhdGlvbi9ydGYnLFxuICAgICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnLFxuICAgICdhcHBsaWNhdGlvbi92bmQub3BlbnhtbGZvcm1hdHMtb2ZmaWNlZG9jdW1lbnQuc3ByZWFkc2hlZXRtbC5zaGVldCcsXG5dO1xuZXhwb3J0IGNvbnN0IFRleHRNaW1lVHlwZXMgPSBbXG4gICAgJ3RleHQvY3NzJyxcbiAgICAndGV4dC9jc3YnLFxuICAgICd0ZXh0L2h0bWwnLFxuICAgICd0ZXh0L2NhbGVuZGFyJyxcbiAgICAndGV4dC9qYXZhc2NyaXB0JyxcbiAgICAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ2FwcGxpY2F0aW9uL2xkK2pzb24nLFxuICAgICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICd0ZXh0L3BsYWluJyxcbiAgICAnYXBwbGljYXRpb24veGh0bWwreG1sJyxcbiAgICAnYXBwbGljYXRpb24veG1sJyxcbiAgICAndGV4dC94bWwnLFxuXTtcbmV4cG9ydCBjb25zdCBCaW5hcnlEb2NzTWltZVR5cGVzID0gW1xuICAgICdhcHBsaWNhdGlvbi9lcHViK3ppcCcsXG4gICAgJ2FwcGxpY2F0aW9uL3BkZicsXG5dO1xuZXhwb3J0IGNvbnN0IEZvbnRNaW1lVHlwZXMgPSBbXG4gICAgJ2ZvbnQvb3RmJyxcbiAgICAnZm9udC90dGYnLFxuICAgICdmb250L3dvZmYnLFxuICAgICdmb250L3dvZmYyJyxcbl07XG5leHBvcnQgY29uc3QgT3RoZXJNaW1lVHlwZXMgPSBbXG4gICAgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgJ2FwcGxpY2F0aW9uL3gtY3NoJyxcbiAgICAnYXBwbGljYXRpb24vdm5kLmFwcGxlLmluc3RhbGxlcit4bWwnLFxuICAgICdhcHBsaWNhdGlvbi94LWh0dHBkLXBocCcsXG4gICAgJ2FwcGxpY2F0aW9uL3gtc2gnLFxuICAgICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCcsXG4gICAgJ3ZuZC52aXNpbycsXG4gICAgJ2FwcGxpY2F0aW9uL3ZuZC5tb3ppbGxhLnh1bCt4bWwnLFxuXTtcbmV4cG9ydCBjb25zdCBNaW1lVHlwZXMgPSBbXG4gICAgLi4uQXVkaW9NaW1lVHlwZXMsXG4gICAgLi4uVmlkZW9NaW1lVHlwZXMsXG4gICAgLi4uSW1hZ2VNaW1lVHlwZXMsXG4gICAgLi4uQ29tcHJlc3NlZE1pbWVUeXBlcyxcbiAgICAuLi5Eb2N1bWVudE1pbWVUeXBlcyxcbiAgICAuLi5UZXh0TWltZVR5cGVzLFxuICAgIC4uLkJpbmFyeURvY3NNaW1lVHlwZXMsXG4gICAgLi4uT3RoZXJNaW1lVHlwZXMsXG4gICAgLi4uRm9udE1pbWVUeXBlcyxcbiAgICAuLi5PdGhlck1pbWVUeXBlcyxcbl07XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBCb3gsIEJ1dHRvbiwgSWNvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuaW1wb3J0IHsgZmxhdCB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEF1ZGlvTWltZVR5cGVzLCBJbWFnZU1pbWVUeXBlcyB9IGZyb20gJy4uL3R5cGVzL21pbWUtdHlwZXMudHlwZS5qcyc7XG5jb25zdCBTaW5nbGVGaWxlID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBuYW1lLCBwYXRoLCBtaW1lVHlwZSwgd2lkdGggfSA9IHByb3BzO1xuICAgIGlmIChwYXRoICYmIHBhdGgubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtaW1lVHlwZSAmJiBJbWFnZU1pbWVUeXBlcy5pbmNsdWRlcyhtaW1lVHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImltZ1wiLCB7IHNyYzogcGF0aCwgc3R5bGU6IHsgbWF4SGVpZ2h0OiB3aWR0aCwgbWF4V2lkdGg6IHdpZHRoIH0sIGFsdDogbmFtZSB9KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1pbWVUeXBlICYmIEF1ZGlvTWltZVR5cGVzLmluY2x1ZGVzKG1pbWVUeXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIiwgeyBjb250cm9sczogdHJ1ZSwgc3JjOiBwYXRoIH0sXG4gICAgICAgICAgICAgICAgXCJZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGVcIixcbiAgICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiY29kZVwiLCBudWxsLCBcImF1ZGlvXCIpLFxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0cmFja1wiLCB7IGtpbmQ6IFwiY2FwdGlvbnNcIiB9KSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChCb3gsIG51bGwsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQnV0dG9uLCB7IGFzOiBcImFcIiwgaHJlZjogcGF0aCwgbWw6IFwiZGVmYXVsdFwiLCBzaXplOiBcInNtXCIsIHJvdW5kZWQ6IHRydWUsIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChJY29uLCB7IGljb246IFwiRG9jdW1lbnREb3dubG9hZFwiLCBjb2xvcjogXCJ3aGl0ZVwiLCBtcjogXCJkZWZhdWx0XCIgfSksXG4gICAgICAgICAgICBuYW1lKSkpO1xufTtcbmNvbnN0IEZpbGUgPSAoeyB3aWR0aCwgcmVjb3JkLCBwcm9wZXJ0eSB9KSA9PiB7XG4gICAgY29uc3QgeyBjdXN0b20gfSA9IHByb3BlcnR5O1xuICAgIGxldCBwYXRoID0gZmxhdC5nZXQocmVjb3JkPy5wYXJhbXMsIGN1c3RvbS5maWxlUGF0aFByb3BlcnR5KTtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IG5hbWUgPSBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLmZpbGVOYW1lUHJvcGVydHkgPyBjdXN0b20uZmlsZU5hbWVQcm9wZXJ0eSA6IGN1c3RvbS5rZXlQcm9wZXJ0eSk7XG4gICAgY29uc3QgbWltZVR5cGUgPSBjdXN0b20ubWltZVR5cGVQcm9wZXJ0eVxuICAgICAgICAmJiBmbGF0LmdldChyZWNvcmQ/LnBhcmFtcywgY3VzdG9tLm1pbWVUeXBlUHJvcGVydHkpO1xuICAgIGlmICghcHJvcGVydHkuY3VzdG9tLm11bHRpcGxlKSB7XG4gICAgICAgIGlmIChjdXN0b20ub3B0cyAmJiBjdXN0b20ub3B0cy5iYXNlVXJsKSB7XG4gICAgICAgICAgICBwYXRoID0gYCR7Y3VzdG9tLm9wdHMuYmFzZVVybH0vJHtuYW1lfWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFNpbmdsZUZpbGUsIHsgcGF0aDogcGF0aCwgbmFtZTogbmFtZSwgd2lkdGg6IHdpZHRoLCBtaW1lVHlwZTogbWltZVR5cGUgfSkpO1xuICAgIH1cbiAgICBpZiAoY3VzdG9tLm9wdHMgJiYgY3VzdG9tLm9wdHMuYmFzZVVybCkge1xuICAgICAgICBjb25zdCBiYXNlVXJsID0gY3VzdG9tLm9wdHMuYmFzZVVybCB8fCAnJztcbiAgICAgICAgcGF0aCA9IHBhdGgubWFwKChzaW5nbGVQYXRoLCBpbmRleCkgPT4gYCR7YmFzZVVybH0vJHtuYW1lW2luZGV4XX1gKTtcbiAgICB9XG4gICAgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBwYXRoLm1hcCgoc2luZ2xlUGF0aCwgaW5kZXgpID0+IChSZWFjdC5jcmVhdGVFbGVtZW50KFNpbmdsZUZpbGUsIHsga2V5OiBzaW5nbGVQYXRoLCBwYXRoOiBzaW5nbGVQYXRoLCBuYW1lOiBuYW1lW2luZGV4XSwgd2lkdGg6IHdpZHRoLCBtaW1lVHlwZTogbWltZVR5cGVbaW5kZXhdIH0pKSkpKTtcbn07XG5leHBvcnQgZGVmYXVsdCBGaWxlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcyc7XG5jb25zdCBMaXN0ID0gKHByb3BzKSA9PiAoUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlLCB7IHdpZHRoOiAxMDAsIC4uLnByb3BzIH0pKTtcbmV4cG9ydCBkZWZhdWx0IExpc3Q7XG4iLCJpbXBvcnQgeyBGb3JtR3JvdXAsIExhYmVsIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5pbXBvcnQgeyB1c2VUcmFuc2xhdGlvbiB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBGaWxlIGZyb20gJy4vZmlsZS5qcyc7XG5jb25zdCBTaG93ID0gKHByb3BzKSA9PiB7XG4gICAgY29uc3QgeyBwcm9wZXJ0eSB9ID0gcHJvcHM7XG4gICAgY29uc3QgeyB0cmFuc2xhdGVQcm9wZXJ0eSB9ID0gdXNlVHJhbnNsYXRpb24oKTtcbiAgICByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUdyb3VwLCBudWxsLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExhYmVsLCBudWxsLCB0cmFuc2xhdGVQcm9wZXJ0eShwcm9wZXJ0eS5sYWJlbCwgcHJvcGVydHkucmVzb3VyY2VJZCkpLFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGUsIHsgd2lkdGg6IFwiMTAwJVwiLCAuLi5wcm9wcyB9KSkpO1xufTtcbmV4cG9ydCBkZWZhdWx0IFNob3c7XG4iLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBMb2dpbiBmcm9tICcuLi9kaXN0L2FkbWluL2NvbXBvbmVudHMvTG9naW4nXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkxvZ2luID0gTG9naW5cbmltcG9ydCBEYXNoYm9hcmQgZnJvbSAnLi4vZGlzdC9hZG1pbi9jb21wb25lbnRzL0Rhc2hib2FyZCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGFzaGJvYXJkID0gRGFzaGJvYXJkXG5pbXBvcnQgU2NoZW1lVXBsb2FkIGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVVcGxvYWQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNjaGVtZVVwbG9hZCA9IFNjaGVtZVVwbG9hZFxuaW1wb3J0IFNjaGVtZVR5cGVTZWxlY3RFZGl0IGZyb20gJy4uL2Rpc3QvYWRtaW4vY29tcG9uZW50cy9TY2hlbWVUeXBlU2VsZWN0RWRpdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2NoZW1lVHlwZVNlbGVjdEVkaXQgPSBTY2hlbWVUeXBlU2VsZWN0RWRpdFxuaW1wb3J0IFJlY29yZERpZmZlcmVuY2UgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL2xvZ2dlci9saWIvY29tcG9uZW50cy9SZWNvcmREaWZmZXJlbmNlJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWNvcmREaWZmZXJlbmNlID0gUmVjb3JkRGlmZmVyZW5jZVxuaW1wb3J0IFJlY29yZExpbmsgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL2xvZ2dlci9saWIvY29tcG9uZW50cy9SZWNvcmRMaW5rJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWNvcmRMaW5rID0gUmVjb3JkTGlua1xuaW1wb3J0IFVwbG9hZEVkaXRDb21wb25lbnQgZnJvbSAnLi4vbm9kZV9tb2R1bGVzL0BhZG1pbmpzL3VwbG9hZC9idWlsZC9mZWF0dXJlcy91cGxvYWQtZmlsZS9jb21wb25lbnRzL1VwbG9hZEVkaXRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVwbG9hZEVkaXRDb21wb25lbnQgPSBVcGxvYWRFZGl0Q29tcG9uZW50XG5pbXBvcnQgVXBsb2FkTGlzdENvbXBvbmVudCBmcm9tICcuLi9ub2RlX21vZHVsZXMvQGFkbWluanMvdXBsb2FkL2J1aWxkL2ZlYXR1cmVzL3VwbG9hZC1maWxlL2NvbXBvbmVudHMvVXBsb2FkTGlzdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXBsb2FkTGlzdENvbXBvbmVudCA9IFVwbG9hZExpc3RDb21wb25lbnRcbmltcG9ydCBVcGxvYWRTaG93Q29tcG9uZW50IGZyb20gJy4uL25vZGVfbW9kdWxlcy9AYWRtaW5qcy91cGxvYWQvYnVpbGQvZmVhdHVyZXMvdXBsb2FkLWZpbGUvY29tcG9uZW50cy9VcGxvYWRTaG93Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5VcGxvYWRTaG93Q29tcG9uZW50ID0gVXBsb2FkU2hvd0NvbXBvbmVudCJdLCJuYW1lcyI6WyJXcmFwcGVyIiwic3R5bGVkIiwiQm94IiwiU3R5bGVkTG9nbyIsImltZyIsInRoZW1lR2V0IiwiSWxsdXN0cmF0aW9uc1dyYXBwZXIiLCJMb2dpbiIsInByb3BzIiwid2luZG93IiwiX19BUFBfU1RBVEVfXyIsImFjdGlvbiIsImVycm9yTWVzc2FnZSIsInRyYW5zbGF0ZUNvbXBvbmVudCIsInRyYW5zbGF0ZU1lc3NhZ2UiLCJ1c2VUcmFuc2xhdGlvbiIsImJyYW5kaW5nIiwidXNlU2VsZWN0b3IiLCJzdGF0ZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkZyYWdtZW50IiwiZmxleCIsInZhcmlhbnQiLCJiZyIsImhlaWdodCIsImJveFNoYWRvdyIsIndpZHRoIiwiY29sb3IiLCJwIiwiZmxleEdyb3ciLCJkaXNwbGF5IiwicG9zaXRpb24iLCJIMiIsImZvbnRXZWlnaHQiLCJUZXh0IiwibXQiLCJtciIsIklsbHVzdHJhdGlvbiIsInRvcCIsImFzIiwibWV0aG9kIiwiSDUiLCJtYXJnaW5Cb3R0b20iLCJsb2dvIiwic3JjIiwiYWx0IiwiY29tcGFueU5hbWUiLCJNZXNzYWdlQm94IiwibXkiLCJtZXNzYWdlIiwic3BsaXQiLCJsZW5ndGgiLCJGb3JtR3JvdXAiLCJMYWJlbCIsInJlcXVpcmVkIiwiSW5wdXQiLCJuYW1lIiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwiYXV0b0NvbXBsZXRlIiwidGV4dEFsaWduIiwiQnV0dG9uIiwid2l0aE1hZGVXaXRoTG92ZSIsIk1hZGVXaXRoTG92ZSIsIkRhc2hib2FyZCIsIkgxIiwiU2NoZW1lVXBsb2FkIiwib25DaGFuZ2UiLCJwcm9wZXJ0eSIsInJlY29yZCIsIl8iLCJzZXRGaWxlIiwidXNlU3RhdGUiLCJzY2hlbWVTaXplIiwicGFyYW1zIiwic2NoZW1lX3NpemUiLCJzY2hlbWVWZXJzaW9uIiwiRGF0ZSIsInNjaGVtZV92ZXJzaW9uIiwidG9Mb2NhbGVTdHJpbmciLCJkYXRlU3R5bGUiLCJ0aW1lU3R5bGUiLCJ0bSIsImhhbmRsZURyb3AiLCJmaWxlcyIsImVycm9yIiwiZXJyb3JzIiwicGF0aCIsIkJvb2xlYW4iLCJzdHlsZSIsImp1c3RpZnlDb250ZW50IiwiUHJvcGVydHlMYWJlbCIsIkRyb3Bab25lIiwiRHJvcFpvbmVJdGVtIiwiZmlsZW5hbWUiLCJGb3JtTWVzc2FnZSIsInJlc291cmNlSWQiLCJTY2hlbWVUeXBlU2VsZWN0RWRpdCIsImF2YWlsYWJsZVZhbHVlcyIsInByb3BWYWx1ZSIsInZhbHVlIiwibWFwIiwidiIsImxhYmVsIiwiZGVmYXVsdFZhbHVlIiwic2VsZWN0ZWQiLCJmaW5kIiwiYXYiLCJvcGFjaXR5IiwiaWQiLCJTZWxlY3QiLCJvcHRpb25zIiwicyIsImlzRGlzYWJsZWQiLCJUYWJsZUNlbGwiLCJUYWJsZVJvdyIsIlRhYmxlSGVhZCIsIkFkbWluVGFibGUiLCJmbGF0IiwiVGFibGVCb2R5IiwiVmlld0hlbHBlcnMiLCJMaW5rIiwidXNlRWZmZWN0IiwiSWNvbiIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIlJlY29yZERpZmZlcmVuY2UiLCJSZWNvcmRMaW5rIiwiVXBsb2FkRWRpdENvbXBvbmVudCIsIlVwbG9hZExpc3RDb21wb25lbnQiLCJVcGxvYWRTaG93Q29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0VBS0EsTUFBTUEsT0FBTyxHQUFHQyx1QkFBTSxDQUFDQyxnQkFBRyxDQUFFO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztFQUNELE1BQU1DLFVBQVUsR0FBR0YsdUJBQU0sQ0FBQ0csR0FBSTtBQUM5QjtBQUNBLFVBQUEsRUFBWUMscUJBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDbkMsQ0FBQztFQUNELE1BQU1DLG9CQUFvQixHQUFHTCx1QkFBTSxDQUFDQyxnQkFBRyxDQUFFO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztFQUNNLE1BQU1LLEtBQUssR0FBR0EsTUFBTTtFQUN2QixFQUFBLE1BQU1DLEtBQUssR0FBR0MsTUFBTSxDQUFDQyxhQUFhO0lBQ2xDLE1BQU07TUFBRUMsTUFBTTtFQUFFQyxJQUFBQTtFQUFhLEdBQUMsR0FBR0osS0FBSztJQUN0QyxNQUFNO01BQUVLLGtCQUFrQjtFQUFFQyxJQUFBQTtLQUFrQixHQUFHQyxzQkFBYyxFQUFFO0lBQ2pFLE1BQU1DLFFBQVEsR0FBR0Msc0JBQVcsQ0FBRUMsS0FBSyxJQUFLQSxLQUFLLENBQUNGLFFBQVEsQ0FBQztFQUN2RCxFQUFBLG9CQUFRRyxzQkFBSyxDQUFDQyxhQUFhLENBQUNELHNC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QUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0VBQy9ELENBQUM7O0VDVkQwRyxPQUFPLENBQUNDLGNBQWMsR0FBRyxFQUFFO0VBRTNCRCxPQUFPLENBQUNDLGNBQWMsQ0FBQ3ZILEtBQUssR0FBR0EsS0FBSztFQUVwQ3NILE9BQU8sQ0FBQ0MsY0FBYyxDQUFDN0QsU0FBUyxHQUFHQSxTQUFTO0VBRTVDNEQsT0FBTyxDQUFDQyxjQUFjLENBQUMzRCxZQUFZLEdBQUdBLFlBQVk7RUFFbEQwRCxPQUFPLENBQUNDLGNBQWMsQ0FBQzVCLG9CQUFvQixHQUFHQSxvQkFBb0I7RUFFbEUyQixPQUFPLENBQUNDLGNBQWMsQ0FBQ0MsZ0JBQWdCLEdBQUdBLGdCQUFnQjtFQUUxREYsT0FBTyxDQUFDQyxjQUFjLENBQUNFLFVBQVUsR0FBR0EsVUFBVTtFQUU5Q0gsT0FBTyxDQUFDQyxjQUFjLENBQUNHLG1CQUFtQixHQUFHQSxJQUFtQjtFQUVoRUosT0FBTyxDQUFDQyxjQUFjLENBQUNJLG1CQUFtQixHQUFHQSxJQUFtQjtFQUVoRUwsT0FBTyxDQUFDQyxjQUFjLENBQUNLLG1CQUFtQixHQUFHQSxJQUFtQjs7Ozs7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOls0LDUsNiw3LDgsOSwxMCwxMV19
