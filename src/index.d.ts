// tslint:disable:max-classes-per-file
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import { ComponentType, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export function getUniqueID(): string;
export function openUrl(url: string): void;

export function hasParents(parents: any[], type: string): boolean;

export type RenderFunction = (
  node: ASTNode,
  children: ReactNode[],
  parentNodes: ASTNode[],
  styles: unknown,
  styleObj?: any,
  // must have this so that we can have fixed overrides with more arguments
  ...args: any
) => ReactNode;

export type RenderLinkFunction = (
  node: ASTNode,
  children: ReactNode[],
  parentNodes: ASTNode[],
  styles: unknown,
  onLinkPress?: (url: string) => boolean
) => ReactNode;

export type RenderImageFunction = (
  node: ASTNode,
  children: ReactNode[],
  parentNodes: ASTNode[],
  styles: unknown,
  allowedImageHandlers: string[],
  defaultImageHandler: string
) => ReactNode;

export interface RenderRules {
  [name: string]: RenderFunction | undefined;
  link?: RenderLinkFunction;
  blocklink?: RenderLinkFunction;
  image?: RenderImageFunction;
}

export const renderRules: RenderRules;

export interface MarkdownParser {
  parse: (value: string, options: unknown) => Token[];
}

export interface ASTNode {
  type: string;
  sourceType: string; // original source token name
  key: string;
  content: string;
  markup: string;
  tokenIndex: number;
  index: number;
  attributes: Record<string, unknown>;
  children: ASTNode[];
}

export class AstRenderer {
  constructor(renderRules: RenderRules, style?: unknown);
  getRenderFunction(type: string): RenderFunction;
  renderNode(node: unknown, parentNodes: ReadonlyArray<unknown>): ReactNode;
  render(nodes: ReadonlyArray<unknown>): View;
}

export function parser(
  source: string,
  renderer: (node: ASTNode) => View,
  parser: MarkdownParser
): unknown;

export function stringToTokens(
  source: string,
  markdownIt: MarkdownParser
): Token[];

export function tokensToAST(tokens: ReadonlyArray<Token>): ASTNode[];

export interface MarkdownProps {
  children: ReactNode;
  rules?: RenderRules;
  style?: StyleSheet.NamedStyles<unknown>;
  renderer?: AstRenderer;
  markdownit?: MarkdownIt;
  mergeStyle?: boolean;
  debugPrintTree?: boolean;
  onLinkPress?: (url: string) => boolean;
}

type MarkdownStatic = ComponentType<MarkdownProps>;
export const Markdown: MarkdownStatic;
export type Markdown = MarkdownStatic;
export { MarkdownIt };
export default Markdown;
