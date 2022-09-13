import React, { memo, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import parser from "./lib/parser";
import getUniqueID from "./lib/util/getUniqueID";
import hasParents from "./lib/util/hasParents";
import openUrl from "./lib/util/openUrl";
import tokensToAST from "./lib/util/tokensToAST";
import renderRules from "./lib/renderRules";
import AstRenderer from "./lib/AstRenderer";
import MarkdownIt from "markdown-it";
import removeTextStyleProps from "./lib/util/removeTextStyleProps";
import { styles } from "./lib/styles";
import { stringToTokens } from "./lib/util/stringToTokens";
import FitImage from "react-native-fit-image";
import textStyleProps from "./lib/data/textStyleProps";

// TODO: Add prop for customizing link colors
// TODO: Improve handling images

export {
  getUniqueID,
  openUrl,
  hasParents,
  parser,
  stringToTokens,
  tokensToAST,
  removeTextStyleProps,
  renderRules,
  styles,
  AstRenderer,
  MarkdownIt,
  FitImage,
  textStyleProps,
};

// we use StyleSheet.flatten here to make sure we have an object, in case someone
// passes in a StyleSheet.create result to the style prop
const getStyle = (mergeStyle, style) => {
  let useStyles = {};

  if (mergeStyle === true && style !== null) {
    // make sure we get anything user defuned
    Object.keys(style).forEach((value) => {
      useStyles[value] = {
        ...StyleSheet.flatten(style[value]),
      };
    });

    // combine any existing styles
    Object.keys(styles).forEach((value) => {
      useStyles[value] = {
        ...styles[value],
        ...StyleSheet.flatten(style[value]),
      };
    });
  } else {
    useStyles = {
      ...styles,
    };

    if (style !== null) {
      Object.keys(style).forEach((value) => {
        useStyles[value] = {
          ...StyleSheet.flatten(style[value]),
        };
      });
    }
  }

  Object.keys(useStyles).forEach((value) => {
    useStyles["_VIEW_SAFE_" + value] = removeTextStyleProps(useStyles[value]);
  });

  return StyleSheet.create(useStyles);
};

const getRenderer = (
  renderer,
  rules,
  style,
  mergeStyle,
  onLinkPress,
  maxTopLevelChildren,
  topLevelMaxExceededItem,
  allowedImageHandlers,
  defaultImageHandler,
  debugPrintTree
) => {
  if (renderer && rules) {
    console.warn(
      "react-native-markdown-display you are using renderer and rules at the same time. This is not possible, props.rules is ignored"
    );
  }

  if (renderer && style) {
    console.warn(
      "react-native-markdown-display you are using renderer and style at the same time. This is not possible, props.style is ignored"
    );
  }

  // these checks are here to prevent extra overhead.
  if (renderer) {
    if (!(typeof renderer === "function") || renderer instanceof AstRenderer) {
      return renderer;
    } else {
      throw new Error(
        "Provided renderer is not compatible with function or AstRenderer. please change"
      );
    }
  } else {
    let useStyles = getStyle(mergeStyle, style);

    return new AstRenderer(
      {
        ...renderRules,
        ...(rules || {}),
      },
      useStyles,
      onLinkPress,
      maxTopLevelChildren,
      topLevelMaxExceededItem,
      allowedImageHandlers,
      defaultImageHandler,
      debugPrintTree
    );
  }
};

const Markdown = ({
  children,
  renderer = null,
  rules = null,
  style = null,
  mergeStyle = true,
  markdownit = MarkdownIt({
    typographer: true,
  }),
  onLinkPress,
  maxTopLevelChildren = null,
  topLevelMaxExceededItem = <Text key="dotdotdot">...</Text>,
  allowedImageHandlers = [
    "data:image/png;base64",
    "data:image/gif;base64",
    "data:image/jpeg;base64",
    "https://",
    "http://",
  ],
  defaultImageHandler = "https://",
  debugPrintTree = false,
}) => {
  const momoizedRenderer = useMemo(
    () =>
      getRenderer(
        renderer,
        rules,
        style,
        mergeStyle,
        onLinkPress,
        maxTopLevelChildren,
        topLevelMaxExceededItem,
        allowedImageHandlers,
        defaultImageHandler,
        debugPrintTree
      ),
    [
      maxTopLevelChildren,
      onLinkPress,
      renderer,
      rules,
      style,
      mergeStyle,
      topLevelMaxExceededItem,
      allowedImageHandlers,
      defaultImageHandler,
      debugPrintTree,
    ]
  );

  const momoizedParser = useMemo(() => markdownit, [markdownit]);

  return parser(children, momoizedRenderer.render, momoizedParser);
};

export default memo(Markdown);
