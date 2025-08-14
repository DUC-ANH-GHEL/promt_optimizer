import { z } from 'zod';

/**
 * 导入导出接口定义
 *
 * 这个文件定义了导入导出相关的接口，避免循环依赖
 */
/**
 * 可导入导出的服务接口
 * 所有需要参与数据导入导出的服务都应该实现此接口
 */
interface IImportExportable {
    /**
     * 导出服务的所有数据
     * @returns 服务数据的JSON表示
     */
    exportData(): Promise<any>;
    /**
     * 导入数据到服务
     * @param data 要导入的数据
     */
    importData(data: any): Promise<void>;
    /**
     * 获取服务的数据类型标识
     * 用于在导入导出JSON中标识数据类型
     */
    getDataType(): Promise<string>;
    /**
     * 验证数据格式是否正确
     * @param data 要验证的数据
     * @returns 是否为有效格式
     */
    validateData(data: any): Promise<boolean>;
}

interface IPreferenceService extends IImportExportable {
    get<T>(key: string, defaultValue: T): Promise<T>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    keys(): Promise<string[]>;
    clear(): Promise<void>;
    /**
     * 获取所有偏好设置
     * @returns 包含所有偏好设置的键值对对象
     */
    getAll(): Promise<Record<string, string>>;
}

/**
 * Supported built-in template languages
 */
type BuiltinTemplateLanguage = 'zh-CN' | 'en-US';
/**
 * Template language service interface
 */
interface ITemplateLanguageService {
    initialize(): Promise<void>;
    getCurrentLanguage(): Promise<BuiltinTemplateLanguage>;
    setLanguage(language: BuiltinTemplateLanguage): Promise<void>;
    toggleLanguage(): Promise<BuiltinTemplateLanguage>;
    isValidLanguage(language: string): Promise<boolean>;
    getSupportedLanguages(): Promise<BuiltinTemplateLanguage[]>;
    getLanguageDisplayName(language: BuiltinTemplateLanguage): string;
    isInitialized(): boolean;
}
/**
 * Simplified built-in template language service
 */
declare class TemplateLanguageService implements ITemplateLanguageService {
    private readonly SUPPORTED_LANGUAGES;
    private readonly DEFAULT_LANGUAGE;
    private currentLanguage;
    private preferenceService;
    private initialized;
    constructor(preferenceService: IPreferenceService);
    /**
     * Initialize the service
     */
    initialize(): Promise<void>;
    /**
     * Get current language
     */
    getCurrentLanguage(): Promise<BuiltinTemplateLanguage>;
    /**
     * Set language
     */
    setLanguage(language: BuiltinTemplateLanguage): Promise<void>;
    /**
     * Toggle between Chinese and English
     */
    toggleLanguage(): Promise<BuiltinTemplateLanguage>;
    /**
     * Check if language is valid
     */
    isValidLanguage(language: string): Promise<boolean>;
    /**
     * Get supported languages list
     */
    getSupportedLanguages(): Promise<BuiltinTemplateLanguage[]>;
    /**
     * Get display name for a language
     */
    getLanguageDisplayName(language: BuiltinTemplateLanguage): string;
    /**
     * Check if initialized
     */
    isInitialized(): boolean;
}
/**
 * 创建模板语言服务实例的工厂函数
 * @param preferenceService 偏好设置服务实例
 * @returns 模板语言服务实例
 */
declare function createTemplateLanguageService(preferenceService: IPreferenceService): TemplateLanguageService;

/**
 * 提示词元数据
 */
interface TemplateMetadata {
    version: string;
    lastModified: number;
    author?: string;
    description?: string;
    templateType: 'optimize' | 'userOptimize' | 'iterate';
    language?: 'zh' | 'en';
    [key: string]: any;
}
/**
 * 消息模板定义
 */
interface MessageTemplate {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
/**
 * 提示词定义
 */
interface Template {
    id: string;
    name: string;
    content: string | MessageTemplate[];
    metadata: TemplateMetadata;
    isBuiltin?: boolean;
}
/**
 * 提示词来源类型
 */
type TemplateSourceType = 'builtin' | 'localStorage';
/**
 * 提示词管理器接口
 */
interface ITemplateManager extends IImportExportable {
    /**
     * Get a template by ID
     */
    getTemplate(id: string): Promise<Template>;
    /**
     * Save a template
     */
    saveTemplate(template: Template): Promise<void>;
    /**
     * Delete a template
     */
    deleteTemplate(id: string): Promise<void>;
    /**
     * List all templates
     */
    listTemplates(): Promise<Template[]>;
    /**
     * Export a template as JSON string
     */
    exportTemplate(id: string): Promise<string>;
    /**
     * Import a template from JSON string
     */
    importTemplate(jsonString: string): Promise<void>;
    /**
     * List templates by type
     */
    listTemplatesByType(type: 'optimize' | 'userOptimize' | 'iterate'): Promise<Template[]>;
    /**
     * Change built-in template language
     */
    changeBuiltinTemplateLanguage(language: BuiltinTemplateLanguage): Promise<void>;
    /**
     * Get current built-in template language
     */
    getCurrentBuiltinTemplateLanguage(): Promise<BuiltinTemplateLanguage>;
    /**
     * Get supported built-in template languages
     */
    getSupportedBuiltinTemplateLanguages(): Promise<BuiltinTemplateLanguage[]>;
}
/**
 * 消息模板验证Schema
 */
declare const messageTemplateSchema: z.ZodObject<{
    role: z.ZodEnum<["system", "user", "assistant"]>;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    role: "system" | "user" | "assistant";
    content: string;
}, {
    role: "system" | "user" | "assistant";
    content: string;
}>;
/**
 * 提示词验证Schema
 */
declare const templateSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    content: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "user", "assistant"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "system" | "user" | "assistant";
        content: string;
    }, {
        role: "system" | "user" | "assistant";
        content: string;
    }>, "many">]>;
    metadata: z.ZodObject<{
        version: z.ZodString;
        lastModified: z.ZodNumber;
        author: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        templateType: z.ZodEnum<["optimize", "userOptimize", "iterate"]>;
        language: z.ZodOptional<z.ZodEnum<["zh", "en"]>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        version: z.ZodString;
        lastModified: z.ZodNumber;
        author: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        templateType: z.ZodEnum<["optimize", "userOptimize", "iterate"]>;
        language: z.ZodOptional<z.ZodEnum<["zh", "en"]>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        version: z.ZodString;
        lastModified: z.ZodNumber;
        author: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        templateType: z.ZodEnum<["optimize", "userOptimize", "iterate"]>;
        language: z.ZodOptional<z.ZodEnum<["zh", "en"]>>;
    }, z.ZodTypeAny, "passthrough">>;
    isBuiltin: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content: string | {
        role: "system" | "user" | "assistant";
        content: string;
    }[];
    id: string;
    name: string;
    metadata: {
        version: string;
        lastModified: number;
        templateType: "optimize" | "userOptimize" | "iterate";
        author?: string | undefined;
        description?: string | undefined;
        language?: "zh" | "en" | undefined;
    } & {
        [k: string]: unknown;
    };
    isBuiltin?: boolean | undefined;
}, {
    content: string | {
        role: "system" | "user" | "assistant";
        content: string;
    }[];
    id: string;
    name: string;
    metadata: {
        version: string;
        lastModified: number;
        templateType: "optimize" | "userOptimize" | "iterate";
        author?: string | undefined;
        description?: string | undefined;
        language?: "zh" | "en" | undefined;
    } & {
        [k: string]: unknown;
    };
    isBuiltin?: boolean | undefined;
}>;

interface IStorageProvider {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clearAll(): Promise<void>;
    updateData<T>(key: string, modifier: (currentValue: T | null) => T): Promise<void>;
    batchUpdate(operations: Array<{
        key: string;
        operation: 'set' | 'remove';
        value?: string;
    }>): Promise<void>;
    getCapabilities?(): {
        supportsAtomic: boolean;
        supportsBatch: boolean;
        maxStorageSize?: number;
    };
}

/**
 * 提示词管理器实现
 */
declare class TemplateManager implements ITemplateManager {
    private storageProvider;
    private languageService;
    private readonly staticLoader;
    constructor(storageProvider: IStorageProvider, languageService: ITemplateLanguageService);
    private validateTemplateSchema;
    /**
     * Validates template ID
     * @param id Template ID
     */
    private validateTemplateId;
    /**
     * Gets a template by ID
     * @param id Template ID
     * @returns Template or null if not found
     */
    getTemplate(id: string | null | undefined): Promise<Template>;
    /**
     * Saves a template
     * @param template Template to save
     */
    saveTemplate(template: Template): Promise<void>;
    /**
     * Deletes a template
     * @param id Template ID
     */
    deleteTemplate(id: string): Promise<void>;
    /**
     * Lists all templates
     * @returns Array of templates
     */
    listTemplates(): Promise<Template[]>;
    /**
     * Exports a template as a JSON string
     * @param id Template ID
     * @returns Template as JSON string
     */
    exportTemplate(id: string): Promise<string>;
    /**
     * Imports a template from a JSON string
     * @param jsonString Template as JSON string
     * @returns Promise<void>
     */
    importTemplate(jsonString: string): Promise<void>;
    /**
     * Get built-in templates based on current language setting
     */
    private getBuiltinTemplates;
    /**
     * Load user templates from storage
     */
    private getUserTemplates;
    /**
     * Saves user templates to storage
     */
    private persistUserTemplates;
    /**
     * Get template set for the specified language
     * This method provides better extensibility for adding new languages
     */
    private getTemplateSet;
    /**
     * List templates by type
     */
    listTemplatesByType(type: 'optimize' | 'userOptimize' | 'iterate'): Promise<Template[]>;
    /**
     * Change built-in template language
     */
    changeBuiltinTemplateLanguage(language: BuiltinTemplateLanguage): Promise<void>;
    /**
     * Get current built-in template language
     */
    getCurrentBuiltinTemplateLanguage(): Promise<BuiltinTemplateLanguage>;
    /**
     * Get supported built-in template languages
     */
    getSupportedBuiltinTemplateLanguages(): Promise<BuiltinTemplateLanguage[]>;
    /**
     * 导出所有用户模板
     */
    exportData(): Promise<Template[]>;
    /**
     * 导入用户模板
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证模板数据格式
     */
    validateData(data: any): Promise<boolean>;
    /**
     * 验证单个模板配置
     */
    private validateSingleTemplate;
}
/**
 * 创建模板管理器的工厂函数
 * @param storageProvider 存储提供器实例
 * @param languageService 模板语言服务实例
 * @returns 模板管理器实例
 */
declare function createTemplateManager(storageProvider: IStorageProvider, languageService: ITemplateLanguageService): TemplateManager;

/**
 * 模型配置接口
 */
interface ModelConfig {
    /** 模型名称 */
    name: string;
    /** API基础URL */
    baseURL: string;
    /** API密钥 */
    apiKey?: string;
    /** 支持的模型列表 (可选，不直接使用) */
    models?: string[];
    /** 默认模型 */
    defaultModel: string;
    /** 是否启用 */
    enabled: boolean;
    /** 提供商 */
    provider: 'deepseek' | 'gemini' | 'custom' | 'zhipu' | string;
    /** 是否使用Vercel代理 */
    useVercelProxy?: boolean;
    /** LLM特定参数 */
    llmParams?: Record<string, any>;
}
/**
 * 模型管理器接口
 */
interface IModelManager extends IImportExportable {
    /** 确保管理器已初始化 */
    ensureInitialized(): Promise<void>;
    /** 检查管理器是否已初始化 */
    isInitialized(): Promise<boolean>;
    /** 获取所有模型配置 */
    getAllModels(): Promise<Array<ModelConfig & {
        key: string;
    }>>;
    /** 获取指定模型配置 */
    getModel(key: string): Promise<ModelConfig | undefined>;
    /** 添加模型配置 */
    addModel(key: string, config: ModelConfig): Promise<void>;
    /** 更新模型配置 */
    updateModel(key: string, config: Partial<ModelConfig>): Promise<void>;
    /** 删除模型配置 */
    deleteModel(key: string): Promise<void>;
    /** 启用模型 */
    enableModel(key: string): Promise<void>;
    /** 禁用模型 */
    disableModel(key: string): Promise<void>;
    /** 获取启用的模型 */
    getEnabledModels(): Promise<Array<ModelConfig & {
        key: string;
    }>>;
}

/**
 * 消息类型
 */
interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
/**
 * LLM响应结构
 */
interface LLMResponse {
    content: string;
    reasoning?: string;
    metadata?: {
        model?: string;
        tokens?: number;
        finishReason?: string;
    };
}
/**
 * 流式响应处理器
 * 支持传统格式和结构化格式
 */
interface StreamHandlers {
    onToken: (token: string) => void;
    onReasoningToken?: (token: string) => void;
    onComplete: (response?: LLMResponse) => void;
    onError: (error: Error) => void;
}
/**
 * 模型信息接口
 */
interface ModelInfo {
    id: string;
    name: string;
}
/**
 * 用于下拉选择组件的模型选项格式
 */
interface ModelOption {
    value: string;
    label: string;
}
/**
 * LLM服务接口
 */
interface ILLMService {
    /**
     * 发送消息（传统格式，返回合并的字符串）
     * @deprecated 建议使用 sendMessageStructured 获得更好的语义支持
     * @throws {RequestConfigError} 当参数无效时
     * @throws {APIError} 当请求失败时
     */
    sendMessage(messages: Message[], provider: string): Promise<string>;
    /**
     * 发送消息（结构化格式）
     * @throws {RequestConfigError} 当参数无效时
     * @throws {APIError} 当请求失败时
     */
    sendMessageStructured(messages: Message[], provider: string): Promise<LLMResponse>;
    /**
     * 发送流式消息（支持结构化和传统格式）
     * @throws {RequestConfigError} 当参数无效时
     * @throws {APIError} 当请求失败时
     */
    sendMessageStream(messages: Message[], provider: string, callbacks: StreamHandlers): Promise<void>;
    /**
     * 测试连接
     */
    testConnection(provider: string): Promise<void>;
    /**
     * 获取模型列表，以下拉选项格式返回
     * @param provider 提供商标识
     * @param customConfig 自定义配置（可选）
     * @throws {RequestConfigError} 当参数无效时
     * @throws {APIError} 当请求失败时
     */
    fetchModelList(provider: string, customConfig?: Partial<ModelConfig>): Promise<ModelOption[]>;
}

/**
 * 提示词记录类型
 */
type PromptRecordType = 'optimize' | 'userOptimize' | 'iterate' | 'test';
/**
 * 提示词记录接口
 */
interface PromptRecord {
    /** 记录ID */
    id: string;
    /** 原始提示词 */
    originalPrompt: string;
    /** 优化/迭代后的提示词 */
    optimizedPrompt: string;
    /** 记录类型 */
    type: PromptRecordType;
    /** 所属的提示词链ID */
    chainId: string;
    /** 在链中的版本号 */
    version: number;
    /** 前一个版本ID */
    previousId?: string;
    /** 时间戳 */
    timestamp: number;
    /** 使用的模型key */
    modelKey: string;
    /**
     * 使用的模型显示名称
     * 通过modelKey从modelManager中获取，用于UI展示
     * 不存储时使用modelKey作为后备显示
     */
    modelName?: string;
    /** 使用的提示词ID */
    templateId: string;
    /** 迭代时的修改说明 */
    iterationNote?: string;
    /** 元数据 */
    metadata?: {
        optimizationMode?: OptimizationMode;
        [key: string]: any;
    };
}
/**
 * 历史记录链类型
 */
interface PromptRecordChain {
    chainId: string;
    rootRecord: PromptRecord;
    currentRecord: PromptRecord;
    versions: PromptRecord[];
}

/**
 * 历史记录管理器接口
 */
interface IHistoryManager extends IImportExportable {
    /** 添加记录 */
    addRecord(record: PromptRecord): Promise<void>;
    /** 获取所有记录 */
    getRecords(): Promise<PromptRecord[]>;
    /** 获取指定记录 */
    getRecord(id: string): Promise<PromptRecord>;
    /** 删除记录 */
    deleteRecord(id: string): Promise<void>;
    /** 获取迭代链 */
    getIterationChain(recordId: string): Promise<PromptRecord[]>;
    /** 清除所有记录 */
    clearHistory(): Promise<void>;
    /** 获取所有记录链 */
    getAllChains(): Promise<PromptRecordChain[]>;
    /** 获取指定链 */
    getChain(chainId: string): Promise<PromptRecordChain>;
    /** 创建一个新的记录链 */
    createNewChain(params: Omit<PromptRecord, 'chainId' | 'version' | 'previousId'>): Promise<PromptRecordChain>;
    /** 向现有链中添加一次迭代 */
    addIteration(params: {
        chainId: string;
        originalPrompt: string;
        optimizedPrompt: string;
        modelKey: string;
        templateId: string;
        iterationNote?: string;
        metadata?: Record<string, any>;
    }): Promise<PromptRecordChain>;
    /** 删除指定ID的记录链 */
    deleteChain(chainId: string): Promise<void>;
}

/**
 * 优化模式枚举
 * 用于区分不同的提示词优化类型
 */
type OptimizationMode = 'system' | 'user';
/**
 * 优化请求接口
 */
interface OptimizationRequest {
    optimizationMode: OptimizationMode;
    targetPrompt: string;
    templateId?: string;
    modelKey: string;
}
/**
 * 提示词服务接口
 */
interface IPromptService {
    /** 优化提示词 - 支持提示词类型和增强功能 */
    optimizePrompt(request: OptimizationRequest): Promise<string>;
    /** 迭代优化提示词 */
    iteratePrompt(originalPrompt: string, lastOptimizedPrompt: string, iterateInput: string, modelKey: string, templateId?: string): Promise<string>;
    /** 测试提示词 - 支持可选系统提示词 */
    testPrompt(systemPrompt: string, userPrompt: string, modelKey: string): Promise<string>;
    /** 获取历史记录 */
    getHistory(): Promise<PromptRecord[]>;
    /** 获取迭代链 */
    getIterationChain(recordId: string): Promise<PromptRecord[]>;
    /** 优化提示词（流式）- 支持提示词类型和增强功能 */
    optimizePromptStream(request: OptimizationRequest, callbacks: StreamHandlers): Promise<void>;
    /** 迭代优化提示词（流式） */
    iteratePromptStream(originalPrompt: string, lastOptimizedPrompt: string, iterateInput: string, modelKey: string, handlers: StreamHandlers, templateId: string): Promise<void>;
    /** 测试提示词（流式）- 支持可选系统提示词 */
    testPromptStream(systemPrompt: string, userPrompt: string, modelKey: string, callbacks: StreamHandlers): Promise<void>;
}

/**
 * 模板变量上下文
 */
interface TemplateContext {
    originalPrompt?: string;
    iterateInput?: string;
    lastOptimizedPrompt?: string;
    optimizationMode?: OptimizationMode;
    [key: string]: string | undefined;
}
/**
 * Simplified template processor with organized methods
 */
declare class TemplateProcessor {
    /**
     * Process template and return message array
     */
    static processTemplate(template: Template, context: TemplateContext): Message[];
    /**
     * Validate template content
     */
    private static validateTemplate;
    /**
     * Validate context compatibility with template type
     */
    private static validateContextCompatibility;
    /**
     * Build messages from template
     */
    private static buildMessages;
    /**
     * Check if template is simple type
     */
    static isSimpleTemplate(template: Template): boolean;
}

/**
 * 静态模板加载器 - 简化版
 *
 * 🎯 极简设计：模板自身包含完整信息（id、name、language、type等）
 * 🔄 直接使用：无需复杂的元数据推导和映射
 */
type TemplateType = 'optimize' | 'iterate' | 'user-optimize';
type Language = 'zh' | 'en';
interface StaticTemplateCollection {
    all: Record<string, Template>;
    byLanguage: Record<Language, Record<string, Template>>;
    byType: Record<TemplateType, Record<Language, Record<string, Template>>>;
}
declare class StaticLoader {
    private static templateCache;
    /**
     * 静态加载器总是支持的（因为使用的是静态导入）
     */
    isSupported(): boolean;
    /**
     * 语言映射：将 TemplateManager 的语言标识符映射到标准语言标识符
     */
    private mapLanguage;
    /**
     * 加载所有模板（使用模板自身的完整信息）
     */
    loadTemplates(): StaticTemplateCollection;
    /**
     * 根据语言加载模板
     */
    loadTemplatesByLanguage(language: string): Record<string, Template>;
    /**
     * 根据类型和语言获取模板
     */
    getTemplatesByType(type: TemplateType, language?: string): Record<string, Template>;
    /**
     * 获取所有模板 ID
     */
    getAllTemplateIds(): string[];
    /**
     * 获取默认中文模板集合
     */
    getDefaultTemplates(): Record<string, Template>;
    /**
     * 获取默认英文模板集合
     */
    getDefaultTemplatesEn(): Record<string, Template>;
    /**
     * 获取加载状态信息
     */
    getLoaderStatus(): {
        isSupported: boolean;
        totalTemplates: number;
        byLanguage: {
            zh: number;
            en: number;
        };
    };
    /**
     * 重新加载模板（清除缓存）
     */
    reloadTemplates(): Record<string, Template>;
}

/**
 * 提示词错误基类
 */
declare class TemplateError extends Error {
    constructor(message: string);
}
/**
 * 提示词加载错误
 */
declare class TemplateLoadError extends TemplateError {
    templateId: string;
    constructor(message: string, templateId: string);
}
/**
 * 提示词验证错误
 */
declare class TemplateValidationError extends TemplateError {
    constructor(message: string);
}
/**
 * 提示词缓存错误
 */
declare class TemplateCacheError extends TemplateError {
    constructor(message: string);
}
/**
 * 提示词存储错误
 */
declare class TemplateStorageError extends TemplateError {
    constructor(message: string);
}

/**
 * Electron环境下的TemplateManager代理
 * 通过IPC调用主进程中的真实TemplateManager实例
 */
declare class ElectronTemplateManagerProxy implements ITemplateManager {
    private electronAPI;
    constructor();
    getTemplate(id: string): Promise<Template>;
    saveTemplate(template: Template): Promise<void>;
    deleteTemplate(id: string): Promise<void>;
    listTemplates(): Promise<Template[]>;
    exportTemplate(id: string): Promise<string>;
    importTemplate(jsonString: string): Promise<void>;
    listTemplatesByType(type: 'optimize' | 'userOptimize' | 'iterate'): Promise<Template[]>;
    changeBuiltinTemplateLanguage(language: BuiltinTemplateLanguage): Promise<void>;
    getCurrentBuiltinTemplateLanguage(): Promise<BuiltinTemplateLanguage>;
    getSupportedBuiltinTemplateLanguages(): Promise<BuiltinTemplateLanguage[]>;
    /**
     * 导出所有用户模板
     */
    exportData(): Promise<Template[]>;
    /**
     * 导入用户模板
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证模板数据格式
     */
    validateData(data: any): Promise<boolean>;
}

/**
 * Electron环境下的TemplateLanguageService代理
 * 通过template namespace的IPC调用主进程中的语言相关功能
 */
declare class ElectronTemplateLanguageServiceProxy implements ITemplateLanguageService {
    private electronAPI;
    constructor();
    initialize(): Promise<void>;
    getCurrentLanguage(): Promise<BuiltinTemplateLanguage>;
    setLanguage(language: BuiltinTemplateLanguage): Promise<void>;
    toggleLanguage(): Promise<BuiltinTemplateLanguage>;
    isValidLanguage(language: string): Promise<boolean>;
    getSupportedLanguages(): Promise<BuiltinTemplateLanguage[]>;
    getLanguageDisplayName(language: BuiltinTemplateLanguage): string;
    isInitialized(): boolean;
}

/**
 * History Manager implementation
 */
declare class HistoryManager implements IHistoryManager {
    private readonly storageKey;
    private readonly maxRecords;
    private readonly storage;
    private readonly modelManager;
    constructor(storageProvider: IStorageProvider, modelManager: IModelManager);
    /**
     * Helper function to get model name
     * @param modelKey model key
     * @returns model name or undefined
     */
    private getModelNameByKey;
    /**
     * Add a new record using atomic operation
     * @param record The record to add
     */
    addRecord(record: PromptRecord): Promise<void>;
    /**
     * Get all records
     * @returns Array of prompt records
     */
    getRecords(): Promise<PromptRecord[]>;
    /**
     * Get a specific record by ID
     * @param id Record ID
     * @returns The record or null if not found
     */
    getRecord(id: string): Promise<PromptRecord>;
    /**
     * Delete a record by ID
     * @param id Record ID
     */
    deleteRecord(id: string): Promise<void>;
    /**
     * Get iteration chain for a record
     * @param recordId The ID of the record to start the chain from
     * @returns Array of records forming the iteration chain
     */
    getIterationChain(recordId: string): Promise<PromptRecord[]>;
    /**
     * Clear all history
     */
    clearHistory(): Promise<void>;
    /**
     * Save records to storage
     * @param records Records to save
     */
    private saveToStorage;
    /**
     * Validate a record
     * @param record Record to validate
     */
    private validateRecord;
    /**
     * Create a new chain with initial record
     * @param params Initial record params
     * @returns The new chain
     */
    createNewChain(params: Omit<PromptRecord, 'chainId' | 'version' | 'previousId'>): Promise<PromptRecordChain>;
    /**
     * Add an iteration to an existing chain
     * @param params Parameters for the iteration
     * @returns The updated chain
     */
    addIteration(params: {
        chainId: string;
        originalPrompt: string;
        optimizedPrompt: string;
        modelKey: string;
        templateId: string;
        iterationNote?: string;
        metadata?: Record<string, any>;
    }): Promise<PromptRecordChain>;
    /**
     * Get a chain by ID
     * @param chainId Chain ID
     * @returns The chain
     */
    getChain(chainId: string): Promise<PromptRecordChain>;
    /**
     * Get all chains
     * @returns Array of chains
     */
    getAllChains(): Promise<PromptRecordChain[]>;
    /**
     * Delete a chain by its ID
     * @param chainId The ID of the chain to delete
     */
    deleteChain(chainId: string): Promise<void>;
    /**
     * 导出所有历史记录
     */
    exportData(): Promise<PromptRecord[]>;
    /**
     * 导入历史记录
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证历史记录数据格式
     */
    validateData(data: any): Promise<boolean>;
}
/**
 * 创建聊天历史管理器的工厂函数
 * @param storageProvider 存储提供器实例
 * @param modelManager 模型管理器实例
 * @returns 聊天历史管理器实例
 */
declare function createHistoryManager(storageProvider: IStorageProvider, modelManager: IModelManager): HistoryManager;

/**
 * 历史记录基础错误
 */
declare class HistoryError extends Error {
    constructor(message: string);
}
/**
 * 历史记录未找到错误
 */
declare class HistoryNotFoundError extends HistoryError {
    constructor(id: string);
}
/**
 * 历史记录链错误
 */
declare class HistoryChainError extends HistoryError {
    constructor(message: string);
}
/**
 * 记录不存在错误
 */
declare class RecordNotFoundError extends HistoryError {
    recordId: string;
    constructor(message: string, recordId: string);
}
/**
 * 存储错误
 */
declare class StorageError extends HistoryError {
    operation: 'read' | 'write' | 'delete' | 'init' | 'storage';
    constructor(message: string, operation: 'read' | 'write' | 'delete' | 'init' | 'storage');
}
/**
 * 记录验证错误
 */
declare class RecordValidationError extends HistoryError {
    errors: string[];
    constructor(message: string, errors: string[]);
}

/**
 * Electron环境下的历史记录管理器代理
 * 通过IPC与主进程中的真实HistoryManager通信
 */
declare class ElectronHistoryManagerProxy implements IHistoryManager {
    private get electronAPI();
    addRecord(record: PromptRecord): Promise<void>;
    getRecords(): Promise<PromptRecord[]>;
    getRecord(id: string): Promise<PromptRecord>;
    deleteRecord(id: string): Promise<void>;
    getIterationChain(recordId: string): Promise<PromptRecord[]>;
    clearHistory(): Promise<void>;
    getAllChains(): Promise<PromptRecordChain[]>;
    getChain(chainId: string): Promise<PromptRecordChain>;
    createNewChain(record: Omit<PromptRecord, 'chainId' | 'version' | 'previousId'>): Promise<PromptRecordChain>;
    addIteration(params: {
        chainId: string;
        originalPrompt: string;
        optimizedPrompt: string;
        iterationNote?: string;
        modelKey: string;
        templateId: string;
    }): Promise<PromptRecordChain>;
    deleteChain(chainId: string): Promise<void>;
    /**
     * 导出所有历史记录
     */
    exportData(): Promise<PromptRecord[]>;
    /**
     * 导入历史记录
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证历史记录数据格式
     */
    validateData(data: any): Promise<boolean>;
}

/**
 * 模型管理器实现
 */
declare class ModelManager implements IModelManager {
    private readonly storageKey;
    private readonly storage;
    private initPromise;
    constructor(storageProvider: IStorageProvider);
    /**
     * 确保初始化完成
     */
    ensureInitialized(): Promise<void>;
    /**
     * 检查管理器是否已初始化
     */
    isInitialized(): Promise<boolean>;
    /**
     * 初始化模型管理器
     */
    private init;
    /**
     * 获取默认模型配置
     */
    private getDefaultModels;
    /**
     * 从存储获取模型配置，如果不存在则返回默认配置
     */
    private getModelsFromStorage;
    /**
     * 获取所有模型配置
     */
    getAllModels(): Promise<Array<ModelConfig & {
        key: string;
    }>>;
    /**
     * 获取指定模型配置
     */
    getModel(key: string): Promise<ModelConfig | undefined>;
    /**
     * 添加模型配置
     */
    addModel(key: string, config: ModelConfig): Promise<void>;
    /**
     * 更新模型配置
     */
    updateModel(key: string, config: Partial<ModelConfig>): Promise<void>;
    /**
     * 删除模型配置
     */
    deleteModel(key: string): Promise<void>;
    /**
     * 启用模型
     */
    enableModel(key: string): Promise<void>;
    /**
     * 禁用模型
     */
    disableModel(key: string): Promise<void>;
    /**
     * 验证模型配置
     */
    private validateConfig;
    private validateEnableConfig;
    /**
     * 获取所有已启用的模型配置
     */
    getEnabledModels(): Promise<Array<ModelConfig & {
        key: string;
    }>>;
    /**
     * 导出所有模型配置
     */
    exportData(): Promise<ModelConfig[]>;
    /**
     * 导入模型配置
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证模型数据格式
     */
    validateData(data: any): Promise<boolean>;
    /**
     * 验证单个模型配置
     */
    private validateSingleModel;
}
/**
 * 创建模型管理器的工厂函数
 * @param storageProvider 存储提供器实例
 * @returns 模型管理器实例
 */
declare function createModelManager(storageProvider: IStorageProvider): ModelManager;

/**
 * LLM服务实现 - 基于官方SDK
 */
declare class LLMService implements ILLMService {
    private modelManager;
    constructor(modelManager: ModelManager);
    /**
     * 验证消息格式
     */
    private validateMessages;
    /**
     * 验证模型配置
     */
    private validateModelConfig;
    /**
     * 获取OpenAI实例
     */
    private getOpenAIInstance;
    /**
     * 获取Gemini实例
     */
    private getGeminiModel;
    /**
     * 发送OpenAI消息（结构化格式）
     */
    private sendOpenAIMessageStructured;
    /**
     * 发送Gemini消息（结构化格式）
     */
    private sendGeminiMessageStructured;
    /**
     * 格式化Gemini历史消息
     */
    private formatGeminiHistory;
    /**
     * 发送消息（结构化格式）
     */
    sendMessageStructured(messages: Message[], provider: string): Promise<LLMResponse>;
    /**
     * 发送消息（传统格式，只返回主要内容）
     */
    sendMessage(messages: Message[], provider: string): Promise<string>;
    /**
     * 发送消息（流式，支持结构化和传统格式）
     */
    sendMessageStream(messages: Message[], provider: string, callbacks: StreamHandlers): Promise<void>;
    /**
     * 处理流式内容中的think标签（用于流式场景）
     */
    private processStreamContentWithThinkTags;
    /**
     * 流式发送OpenAI消息
     */
    private streamOpenAIMessage;
    /**
     * 流式发送Gemini消息
     */
    private streamGeminiMessage;
    /**
     * 测试连接
     */
    testConnection(provider: string): Promise<void>;
    /**
     * 获取模型列表，以下拉选项格式返回
     * @param provider 提供商标识
     * @param customConfig 自定义配置（可选）
     */
    fetchModelList(provider: string, customConfig?: Partial<ModelConfig>): Promise<ModelOption[]>;
    /**
     * 获取OpenAI兼容API的模型信息
     */
    private fetchOpenAICompatibleModelsInfo;
    /**
     * 获取Gemini模型信息
     */
    private fetchGeminiModelsInfo;
    /**
     * 获取Anthropic模型信息
     */
    private fetchAnthropicModelsInfo;
    /**
     * 获取DeepSeek模型信息
     */
    private fetchDeepSeekModelsInfo;
    /**
     * 构建Gemini生成配置
     *
     * 注意：此方法假设传入的 llmParams 已经通过 ModelManager.validateConfig()
     * 中的 validateLLMParams 验证，确保安全性
     */
    private buildGeminiGenerationConfig;
}
/**
 * 创建LLM服务实例的工厂函数
 * @param modelManager 模型管理器实例
 * @returns LLM服务实例
 */
declare function createLLMService(modelManager: ModelManager): ILLMService;

/**
 * Electron环境下的LLM服务代理
 * 通过IPC调用主进程中的真实LLMService实例
 */
declare class ElectronLLMProxy implements ILLMService {
    private electronAPI;
    constructor();
    testConnection(provider: string): Promise<void>;
    sendMessage(messages: Message[], provider: string): Promise<string>;
    sendMessageStructured(messages: Message[], provider: string): Promise<LLMResponse>;
    sendMessageStream(messages: Message[], provider: string, callbacks: StreamHandlers): Promise<void>;
    fetchModelList(provider: string, customConfig?: Partial<any>): Promise<ModelOption[]>;
}

/**
 * 基础错误类
 */
declare class BaseError extends Error {
    constructor(message: string);
}
/**
 * API错误
 * 用于表示API调用过程中的错误
 */
declare class APIError extends BaseError {
    constructor(message: string);
}
/**
 * 请求配置错误
 * 用于表示请求配置验证失败的错误
 */
declare class RequestConfigError extends BaseError {
    constructor(message: string);
}
/**
 * 验证错误
 * 用于表示参数验证失败的错误
 */
declare class ValidationError extends BaseError {
    constructor(message: string);
}
/**
 * 初始化错误
 * 用于表示服务初始化失败的错误
 */
declare class InitializationError extends BaseError {
    constructor(message: string);
}
/**
 * LLM服务基础错误
 */
declare class LLMError extends Error {
    constructor(message: string);
}
/**
 * 模型配置错误
 */
declare class ModelConfigError extends LLMError {
    constructor(message: string);
}
declare const ERROR_MESSAGES: {
    readonly API_KEY_REQUIRED: "优化失败: API密钥不能为空";
    readonly MODEL_NOT_FOUND: "优化失败: 模型不存在";
    readonly TEMPLATE_INVALID: "优化失败: 提示词格式无效";
    readonly EMPTY_INPUT: "优化失败: 提示词不能为空";
    readonly OPTIMIZATION_FAILED: "优化失败";
    readonly ITERATION_FAILED: "迭代失败";
    readonly TEST_FAILED: "测试失败";
    readonly MODEL_KEY_REQUIRED: "优化失败: 模型Key不能为空";
    readonly INPUT_TOO_LONG: "优化失败: 输入内容过长";
};

declare const defaultModels: Record<string, ModelConfig>;

interface AdvancedParameterDefinition {
    id: string;
    name: string;
    labelKey: string;
    descriptionKey: string;
    type: 'number' | 'string' | 'boolean' | 'integer';
    defaultValue?: any;
    minValue?: number;
    maxValue?: number;
    step?: number;
    unit?: string;
    unitKey?: string;
    appliesToProviders: string[];
}
declare const advancedParameterDefinitions: AdvancedParameterDefinition[];

/**
 * Electron环境下的ModelManager代理
 * 通过IPC调用主进程中的真实ModelManager实例
 */
declare class ElectronModelManagerProxy implements IModelManager {
    private electronAPI;
    constructor();
    ensureInitialized(): Promise<void>;
    isInitialized(): Promise<boolean>;
    getAllModels(): Promise<Array<ModelConfig & {
        key: string;
    }>>;
    getModel(key: string): Promise<ModelConfig | undefined>;
    addModel(key: string, config: ModelConfig): Promise<void>;
    updateModel(key: string, config: Partial<ModelConfig>): Promise<void>;
    deleteModel(key: string): Promise<void>;
    enableModel(key: string): Promise<void>;
    disableModel(key: string): Promise<void>;
    getEnabledModels(): Promise<Array<ModelConfig & {
        key: string;
    }>>;
    /**
     * 导出所有模型配置
     */
    exportData(): Promise<ModelConfig[]>;
    /**
     * 导入模型配置
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证模型数据格式
     */
    validateData(data: any): Promise<boolean>;
}

/**
 * Electron环境下的配置管理器
 * 确保UI进程和主进程的配置状态完全一致
 */
declare class ElectronConfigManager {
    private static instance;
    private envVars;
    private initialized;
    private constructor();
    static getInstance(): ElectronConfigManager;
    /**
     * 从主进程同步环境变量
     */
    syncFromMainProcess(): Promise<void>;
    /**
     * 获取环境变量
     */
    getEnvVar(key: string): string;
    /**
     * 检查是否已初始化
     */
    isInitialized(): boolean;
    /**
     * 生成默认模型配置（基于同步的环境变量）
     */
    generateDefaultModels(): Record<string, ModelConfig>;
}
/**
 * 检查是否在Electron渲染进程中
 */
declare function isElectronRenderer(): boolean;

type StorageType = 'localStorage' | 'dexie' | 'memory' | 'file';
/**
 * 存储工厂类
 */
declare class StorageFactory {
    private static instances;
    /**
     * 创建存储提供器
     * @param type 存储类型
     * @returns 存储提供器实例
     */
    static create(type: StorageType): IStorageProvider;
    /**
     * 重置所有实例（主要用于测试）
     */
    static reset(): void;
    /**
     * 获取所有支持的存储类型
     */
    static getSupportedTypes(): StorageType[];
    /**
     * 检查特定存储类型是否支持
     */
    static isSupported(type: StorageType): boolean;
}

/**
 * 基于 Dexie 的存储提供器实现
 *
 * 相比 LocalStorageProvider 的优势：
 * - 更大的存储容量（几GB vs 5MB）
 * - 原生事务支持，更好的并发安全
 * - 异步操作，不阻塞UI
 * - 更好的查询性能
 */
declare class DexieStorageProvider implements IStorageProvider {
    private db;
    private dbOpened;
    private keyLocks;
    constructor();
    /**
     * 确保数据库已打开
     */
    private initialize;
    /**
     * 重置迁移状态（主要用于测试）
     */
    static resetMigrationState(): void;
    /**
     * 获取存储项
     */
    getItem(key: string): Promise<string | null>;
    /**
     * 设置存储项
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * 删除存储项
     */
    removeItem(key: string): Promise<void>;
    /**
     * 清空所有存储
     */
    clearAll(): Promise<void>;
    /**
     * 原子更新操作
     * 使用 Dexie 的事务机制确保原子性，带重试和降级机制
     */
    atomicUpdate<T>(key: string, updateFn: (currentValue: T | null) => T): Promise<void>;
    /**
     * 隐藏式数据更新 - 内部使用原子更新实现
     * 实现 IStorageProvider 接口要求
     */
    updateData<T>(key: string, modifier: (currentValue: T | null) => T): Promise<void>;
    /**
     * 类型守卫：检查是否为Error对象
     */
    private isError;
    /**
     * 带重试机制的原子更新
     */
    private _performAtomicUpdateWithRetry;
    /**
     * 简单更新（降级方案）
     */
    private _performSimpleUpdate;
    /**
     * 执行原子更新
     */
    private _performAtomicUpdate;
    /**
     * 批量更新操作
     */
    batchUpdate(operations: Array<{
        key: string;
        operation: 'set' | 'remove';
        value?: string;
    }>): Promise<void>;
    /**
     * 获取存储统计信息
     */
    getStorageInfo(): Promise<{
        itemCount: number;
        estimatedSize: number;
        lastUpdated: number | null;
    }>;
    /**
     * 导出所有数据（用于备份）
     */
    exportAll(): Promise<Record<string, string>>;
    /**
     * 导入数据（用于恢复）
     */
    importAll(data: Record<string, string>): Promise<void>;
    /**
     * 关闭数据库连接
     */
    close(): Promise<void>;
}

/**
 * 增强的LocalStorageProvider，提供事务性操作
 */
declare class LocalStorageProvider implements IStorageProvider {
    private lock;
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clearAll(): Promise<void>;
    /**
     * 隐藏式数据更新 - 内部自动选择最优实现
     * 业务层无需关心是否支持原子操作
     * @param key 存储键
     * @param modifier 修改函数，接收当前值，返回新值
     */
    updateData<T>(key: string, modifier: (currentValue: T | null) => T): Promise<void>;
    /**
     * 获取存储能力信息
     */
    getCapabilities(): {
        supportsAtomic: boolean;
        supportsBatch: boolean;
        maxStorageSize: number;
    };
    /**
     * 批量操作
     * @param operations 批量操作列表
     */
    batchUpdate(operations: Array<{
        key: string;
        operation: 'set' | 'remove';
        value?: string;
    }>): Promise<void>;
}

/**
 * 内存存储提供者
 * 用于 Node.js 环境（如 Electron 主进程）和测试环境
 * 数据仅存储在内存中，应用重启后会丢失
 */
declare class MemoryStorageProvider implements IStorageProvider {
    private storage;
    /**
     * 获取存储项
     * @param key 存储键
     * @returns 存储值或null
     */
    getItem(key: string): Promise<string | null>;
    /**
     * 设置存储项
     * @param key 存储键
     * @param value 存储值
     */
    setItem(key: string, value: string): Promise<void>;
    /**
     * 删除存储项
     * @param key 存储键
     */
    removeItem(key: string): Promise<void>;
    /**
     * 清空所有存储项
     */
    clearAll(): Promise<void>;
    /**
     * 更新数据
     * @param key 存储键
     * @param modifier 修改函数
     */
    updateData<T>(key: string, modifier: (currentValue: T | null) => T): Promise<void>;
    /**
     * 批量更新
     * @param operations 操作数组
     */
    batchUpdate(operations: Array<{
        key: string;
        operation: 'set' | 'remove';
        value?: string;
    }>): Promise<void>;
    /**
     * 获取存储能力
     * @returns 存储能力信息
     */
    getCapabilities(): {
        supportsAtomic: boolean;
        supportsBatch: boolean;
        maxStorageSize: undefined;
    };
    /**
     * 获取存储项数量
     * @returns 存储项数量
     */
    get size(): number;
    /**
     * 检查是否包含指定键
     * @param key 存储键
     * @returns 是否包含该键
     */
    has(key: string): boolean;
    /**
     * 获取所有存储键
     * @returns 所有键的数组
     */
    getAllKeys(): string[];
}

/**
 * 基于文件的存储提供器 - 增强版
 * 专为Electron桌面环境设计，使用JSON文件持久化存储数据
 *
 * 特性：
 * - 延迟写入优化性能，减少I/O操作
 * - 内存缓存提供快速读取
 * - 原子写入确保数据完整性
 * - 数据备份和智能恢复机制
 * - 原子性updateData操作
 * - 严格的初始化控制
 */
declare class FileStorageProvider implements IStorageProvider {
    private filePath;
    private backupPath;
    private data;
    private writeTimeout;
    private isDirty;
    private writeLock;
    private updateLock;
    private initialized;
    private initializationPromise;
    private readonly WRITE_DELAY;
    private readonly TEMP_FILE_SUFFIX;
    private readonly BACKUP_FILE_SUFFIX;
    private readonly MAX_FLUSH_TIME;
    private flushAttempts;
    private readonly MAX_FLUSH_ATTEMPTS;
    constructor(userDataPath: string);
    /**
     * 确保存储已初始化 - 增强版
     * 使用单例模式确保初始化只执行一次
     */
    private ensureInitialized;
    /**
     * 初始化存储，加载现有数据 - 增强版
     * 包含智能恢复机制
     */
    private initialize;
    /**
     * 从文件加载数据到内存 - 增强版，包含智能恢复机制
     */
    private loadFromFileWithRecovery;
    /**
     * 尝试从指定文件加载数据
     */
    private tryLoadFromFile;
    /**
     * 检查文件是否存在
     */
    private fileExists;
    /**
     * 创建备份文件
     */
    private createBackup;
    /**
     * 将内存数据保存到文件 - 增强版
     * 包含备份创建和数据验证
     */
    private saveToFile;
    /**
     * 将内存数据保存到文件 - 不创建备份版本
     * 用于从备份恢复时，避免覆盖完好的备份文件
     */
    private saveToFileWithoutBackup;
    /**
     * 原子写入文件
     */
    private atomicWrite;
    /**
     * 验证JSON格式
     */
    private validateJSON;
    /**
     * 调度延迟写入
     */
    private scheduleWrite;
    /**
     * 立即写入（关键时刻使用）
     * 带有超时保护和重试限制，确保不会无限循环
     */
    flush(): Promise<void>;
    /**
     * 获取写入锁，确保写入操作串行执行
     */
    private acquireWriteLock;
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clearAll(): Promise<void>;
    /**
     * 原子性数据更新 - 增强版
     * 确保读-修改-写操作的原子性，防止并发问题
     */
    updateData<T>(key: string, modifier: (currentValue: T | null) => T): Promise<void>;
    /**
     * 执行原子更新操作
     */
    private performAtomicUpdate;
    /**
     * 获取最新数据，确保数据一致性
     */
    private getLatestData;
    /**
     * 验证值的有效性
     */
    private validateValue;
    batchUpdate(operations: Array<{
        key: string;
        operation: 'set' | 'remove';
        value?: string;
    }>): Promise<void>;
    getCapabilities(): {
        supportsAtomic: boolean;
        supportsBatch: boolean;
        maxStorageSize: undefined;
    };
}

/**
 * 提示词服务实现
 */
declare class PromptService implements IPromptService {
    private modelManager;
    private llmService;
    private templateManager;
    private historyManager;
    constructor(modelManager: IModelManager, llmService: ILLMService, templateManager: ITemplateManager, historyManager: IHistoryManager);
    /**
     * 检查依赖服务是否已初始化
     */
    private checkDependencies;
    /**
     * 验证输入参数
     */
    private validateInput;
    /**
     * 验证LLM响应
     */
    private validateResponse;
    /**
     * 优化提示词 - 支持提示词类型和增强功能
     */
    optimizePrompt(request: OptimizationRequest): Promise<string>;
    /**
     * 迭代优化提示词
     */
    iteratePrompt(originalPrompt: string, lastOptimizedPrompt: string, iterateInput: string, modelKey: string, templateId?: string): Promise<string>;
    /**
     * 测试提示词 - 支持可选系统提示词
     */
    testPrompt(systemPrompt: string, userPrompt: string, modelKey: string): Promise<string>;
    /**
     * 获取历史记录
     */
    getHistory(): Promise<PromptRecord[]>;
    /**
     * 获取迭代链
     */
    getIterationChain(recordId: string): Promise<PromptRecord[]>;
    /**
     * 测试提示词（流式）- 支持可选系统提示词
     */
    testPromptStream(systemPrompt: string, userPrompt: string, modelKey: string, callbacks: StreamHandlers): Promise<void>;
    /**
     * 优化提示词（流式）- 支持提示词类型和增强功能
     */
    optimizePromptStream(request: OptimizationRequest, callbacks: StreamHandlers): Promise<void>;
    /**
     * 迭代优化提示词（流式）
     */
    iteratePromptStream(originalPrompt: string, lastOptimizedPrompt: string, iterateInput: string, modelKey: string, handlers: StreamHandlers, templateId: string): Promise<void>;
    /**
     * 验证优化请求参数
     */
    private validateOptimizationRequest;
    /**
     * 获取默认模板ID
     */
    private getDefaultTemplateId;
}

/**
 * 创建PromptService实例
 * @param modelManager 模型管理器实例
 * @param llmService LLM服务实例
 * @param templateManager 模板管理器实例
 * @param historyManager 历史管理器实例
 * @returns PromptService实例
 */
declare function createPromptService(modelManager: IModelManager, llmService: ILLMService, templateManager: ITemplateManager, historyManager: IHistoryManager): PromptService;

/**
 * Proxy for using PromptService in Electron renderer process.
 * It communicates with the main process via IPC.
 */
declare class ElectronPromptServiceProxy implements IPromptService {
    private get api();
    private get ipc();
    optimizePrompt(request: OptimizationRequest): Promise<string>;
    iteratePrompt(originalPrompt: string, lastOptimizedPrompt: string, iterateInput: string, modelKey: string, templateId?: string): Promise<string>;
    testPrompt(systemPrompt: string, userPrompt: string, modelKey: string): Promise<string>;
    getHistory(): Promise<PromptRecord[]>;
    getIterationChain(recordId: string): Promise<PromptRecord[]>;
    optimizePromptStream(request: OptimizationRequest, callbacks: StreamHandlers): Promise<void>;
    iteratePromptStream(originalPrompt: string, lastOptimizedPrompt: string, iterateInput: string, modelKey: string, callbacks: StreamHandlers, templateId?: string): Promise<void>;
    testPromptStream(systemPrompt: string, userPrompt: string, modelKey: string, callbacks: StreamHandlers): Promise<void>;
}

/**
 * 提示词服务基础错误
 */
declare class PromptError extends Error {
    constructor(message: string);
}
/**
 * 优化错误
 */
declare class OptimizationError extends PromptError {
    originalPrompt: string;
    constructor(message: string, originalPrompt: string);
}
/**
 * 迭代错误
 */
declare class IterationError extends PromptError {
    originalPrompt: string;
    iterateInput: string;
    constructor(message: string, originalPrompt: string, iterateInput: string);
}
/**
 * 测试错误
 */
declare class TestError extends PromptError {
    prompt: string;
    testInput: string;
    constructor(message: string, prompt: string, testInput: string);
}
/**
 * 服务依赖错误
 */
declare class ServiceDependencyError extends PromptError {
    serviceName: string;
    constructor(message: string, serviceName: string);
}

/**
 * 文本变化类型
 */
declare enum ChangeType {
    UNCHANGED = "unchanged",
    ADDED = "added",
    REMOVED = "removed"
}
/**
 * 文本片段
 */
interface TextFragment {
    text: string;
    type: ChangeType;
    index: number;
}
/**
 * 对比结果
 */
interface CompareResult {
    fragments: TextFragment[];
    summary: {
        additions: number;
        deletions: number;
        unchanged: number;
    };
}
/**
 * 对比选项
 */
interface CompareOptions {
    /** 对比粒度：word（单词级）、char（字符级） */
    granularity: 'word' | 'char';
    /** 是否忽略空白符 */
    ignoreWhitespace: boolean;
    /** 是否区分大小写 */
    caseSensitive: boolean;
}
/**
 * 文本对比服务接口
 */
interface ICompareService {
    /**
     * 对比两个文本
     * @param original 原始文本
     * @param optimized 优化后文本
     * @param options 对比选项
     * @returns 对比结果
     */
    compareTexts(original: string, optimized: string, options?: Partial<CompareOptions>): CompareResult;
}

/**
 * 文本对比服务实现 - 使用 jsdiff 库
 */
declare class CompareService implements ICompareService {
    /**
     * 对比两个文本
     */
    compareTexts(original: string, optimized: string, options?: Partial<CompareOptions>): CompareResult;
    /**
     * 验证输入参数
     */
    private validateInput;
    /**
     * 执行文本对比 - 使用 jsdiff
     */
    private performTextComparison;
    /**
     * 将 jsdiff 的结果转换为我们的 TextFragment 格式
     */
    private convertDiffResultToFragments;
    /**
     * 在文本中查找特定内容的位置
     */
    private findTextPosition;
    /**
     * 合并连续的相同类型片段
     */
    private mergeConsecutiveFragments;
    /**
     * 生成统计信息
     */
    private generateSummary;
}
/**
 * 创建文本对比服务实例
 * @returns 文本对比服务实例
 */
declare function createCompareService(): ICompareService;

/**
 * 对比服务错误类
 */
declare class CompareError extends Error {
    constructor(message: string);
}
/**
 * 输入验证错误
 */
declare class CompareValidationError extends CompareError {
    constructor(message: string);
}
/**
 * 对比计算错误
 */
declare class CompareCalculationError extends CompareError {
    constructor(message: string);
}

/**
 * 数据导入导出管理器
 *
 * 采用协调者模式：
 * - DataManager只负责协调各个服务的导入导出
 * - 具体的导入导出实现由各个服务自己负责
 * - 通过IImportExportable接口统一各服务的导入导出行为
 */
/**
 * 数据管理器接口
 */
interface IDataManager$1 {
    /**
     * 导出所有数据
     * @returns JSON格式的数据字符串
     */
    exportAllData(): Promise<string>;
    /**
     * 导入所有数据
     * @param dataString JSON格式的数据字符串
     */
    importAllData(dataString: string): Promise<void>;
}
declare class DataManager implements IDataManager$1 {
    private modelManager;
    private templateManager;
    private historyManager;
    private preferenceService;
    constructor(modelManager: IModelManager, templateManager: ITemplateManager, historyManager: IHistoryManager, preferenceService: IPreferenceService);
    exportAllData(): Promise<string>;
    importAllData(dataString: string): Promise<void>;
}
/**
 * 创建数据管理器的工厂函数
 * @param modelManager 模型管理器实例
 * @param templateManager 模板管理器实例
 * @param historyManager 历史记录管理器实例
 * @param preferenceService 偏好设置服务实例
 * @returns 数据管理器实例
 */
declare function createDataManager(modelManager: IModelManager, templateManager: ITemplateManager, historyManager: IHistoryManager, preferenceService: IPreferenceService): DataManager;

/**
 * 数据管理器接口
 */
interface IDataManager {
    /**
     * 导出所有数据
     * @returns JSON格式的数据字符串
     */
    exportAllData(): Promise<string>;
    /**
     * 导入所有数据
     * @param dataString JSON格式的数据字符串
     */
    importAllData(dataString: string): Promise<void>;
}

/**
 * Electron环境下的DataManager代理
 * 通过IPC调用主进程中的真实DataManager实例
 */
declare class ElectronDataManagerProxy implements IDataManager {
    private electronAPI;
    constructor();
    exportAllData(): Promise<string>;
    importAllData(dataString: string): Promise<void>;
}

declare class ElectronPreferenceServiceProxy implements IPreferenceService {
    private ensureApiAvailable;
    get<T>(key: string, defaultValue: T): Promise<T>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    keys(): Promise<string[]>;
    clear(): Promise<void>;
    getAll(): Promise<Record<string, string>>;
    /**
     * 导出所有偏好设置
     */
    exportData(): Promise<Record<string, string>>;
    /**
     * 导入偏好设置
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证偏好设置数据格式
     */
    validateData(data: any): Promise<boolean>;
}

/**
 * 基于IStorageProvider的偏好设置服务实现
 */
declare class PreferenceService implements IPreferenceService {
    private readonly PREFIX;
    private keyCache;
    private storageProvider;
    constructor(storageProvider: IStorageProvider);
    /**
     * 获取偏好设置
     * @param key 键名
     * @param defaultValue 默认值
     * @returns 设置值，如果不存在则返回默认值
     */
    get<T>(key: string, defaultValue: T): Promise<T>;
    /**
     * 设置偏好设置
     * @param key 键名
     * @param value 值
     */
    set<T>(key: string, value: T): Promise<void>;
    /**
     * 删除偏好设置
     * @param key 键名
     */
    delete(key: string): Promise<void>;
    /**
     * 获取所有偏好设置的键名
     * @returns 键名列表
     */
    keys(): Promise<string[]>;
    /**
     * 清除所有偏好设置
     */
    clear(): Promise<void>;
    /**
     * 获取所有偏好设置
     * @returns 包含所有偏好设置的键值对对象（使用原始键名，不带前缀）
     */
    getAll(): Promise<Record<string, string>>;
    /**
     * 导出所有偏好设置
     */
    exportData(): Promise<Record<string, string>>;
    /**
     * 导入偏好设置
     */
    importData(data: any): Promise<void>;
    /**
     * 获取数据类型标识
     */
    getDataType(): Promise<string>;
    /**
     * 验证偏好设置数据格式
     */
    validateData(data: any): Promise<boolean>;
    /**
     * 获取带前缀的键名
     * @param key 原始键名
     * @returns 带前缀的键名
     * @private
     */
    private getPrefKey;
}
/**
 * 创建偏好设置服务
 * @param storageProvider 存储提供器
 * @returns 偏好设置服务实例
 */
declare function createPreferenceService(storageProvider: IStorageProvider): IPreferenceService;

/**
 * Utility functions for environment detection and configuration.
 */
/**
 * 检查是否在浏览器环境中
 */
declare const isBrowser: () => boolean;
/**
 * 异步检查Vercel API是否可用。
 * 实现"只检查一次"的逻辑，假定状态检查后不会改变。
 */
declare function checkVercelApiAvailability(): Promise<boolean>;
/**
 * 重置Vercel状态缓存，主要用于测试
 */
declare const resetVercelStatusCache: () => void;
/**
 * 获取API代理URL
 * @param baseURL 原始基础URL
 * @param isStream 是否是流式请求
 */
declare const getProxyUrl: (baseURL: string | undefined, isStream?: boolean) => string;
/**
 * 检测是否在Electron环境中运行
 * 使用多重检测机制确保准确性
 */
declare function isRunningInElectron(): boolean;
/**
 * 检测Electron API是否完全就绪
 * 不仅检测环境，还检测关键API的可用性
 */
declare function isElectronApiReady(): boolean;
/**
 * 等待Electron API完全就绪
 * @param timeout 超时时间（毫秒），默认5000ms
 * @returns Promise<boolean> 是否在超时前API就绪
 */
declare function waitForElectronApi(timeout?: number): Promise<boolean>;

/**
 * IPC序列化工具
 * 用于处理Vue响应式对象在Electron IPC通信中的序列化问题
 *
 * 这个工具专门为ElectronProxy类设计，提供统一的序列化处理
 */
/**
 * 安全序列化函数，用于清理Vue响应式对象
 * 确保所有通过IPC传递的对象都是纯净的JavaScript对象
 *
 * @param obj 要序列化的对象
 * @returns 纯净的JavaScript对象
 */
declare function safeSerializeForIPC<T>(obj: T): T;
/**
 * 检查对象是否可以安全地通过IPC传递
 * 主要用于开发时调试
 *
 * @param obj 要检查的对象
 * @param label 对象标签，用于日志输出
 */
declare function debugIPCSerializability(obj: any, label?: string): void;
/**
 * 批量序列化多个参数
 * 用于有多个参数需要序列化的场景
 *
 * @param args 参数数组
 * @returns 序列化后的参数数组
 */
declare function safeSerializeArgs<T extends any[]>(...args: T): T;

/**
 * 统一的存储键常量定义
 *
 * 这是所有存储键的唯一数据源，UI包和Core包都从这里导入。
 * 集中管理所有存储键，避免在多个地方重复定义导致不一致。
 */
declare const CORE_SERVICE_KEYS: {
    readonly MODELS: "models";
    readonly USER_TEMPLATES: "user-templates";
    readonly PROMPT_HISTORY: "prompt_history";
};
declare const UI_SETTINGS_KEYS: {
    readonly THEME_ID: "app:settings:ui:theme-id";
    readonly PREFERRED_LANGUAGE: "app:settings:ui:preferred-language";
    readonly BUILTIN_TEMPLATE_LANGUAGE: "app:settings:ui:builtin-template-language";
};
declare const MODEL_SELECTION_KEYS: {
    readonly OPTIMIZE_MODEL: "app:selected-optimize-model";
    readonly TEST_MODEL: "app:selected-test-model";
};
declare const TEMPLATE_SELECTION_KEYS: {
    readonly SYSTEM_OPTIMIZE_TEMPLATE: "app:selected-optimize-template";
    readonly USER_OPTIMIZE_TEMPLATE: "app:selected-user-optimize-template";
    readonly ITERATE_TEMPLATE: "app:selected-iterate-template";
};
declare const ALL_STORAGE_KEYS: {
    readonly SYSTEM_OPTIMIZE_TEMPLATE: "app:selected-optimize-template";
    readonly USER_OPTIMIZE_TEMPLATE: "app:selected-user-optimize-template";
    readonly ITERATE_TEMPLATE: "app:selected-iterate-template";
    readonly OPTIMIZE_MODEL: "app:selected-optimize-model";
    readonly TEST_MODEL: "app:selected-test-model";
    readonly THEME_ID: "app:settings:ui:theme-id";
    readonly PREFERRED_LANGUAGE: "app:settings:ui:preferred-language";
    readonly BUILTIN_TEMPLATE_LANGUAGE: "app:settings:ui:builtin-template-language";
    readonly MODELS: "models";
    readonly USER_TEMPLATES: "user-templates";
    readonly PROMPT_HISTORY: "prompt_history";
};
declare const ALL_STORAGE_KEYS_ARRAY: ("models" | "user-templates" | "prompt_history" | "app:settings:ui:theme-id" | "app:settings:ui:preferred-language" | "app:settings:ui:builtin-template-language" | "app:selected-optimize-model" | "app:selected-test-model" | "app:selected-optimize-template" | "app:selected-user-optimize-template" | "app:selected-iterate-template")[];
type CoreServiceKey = typeof CORE_SERVICE_KEYS[keyof typeof CORE_SERVICE_KEYS];
type UISettingsKey = typeof UI_SETTINGS_KEYS[keyof typeof UI_SETTINGS_KEYS];
type ModelSelectionKey = typeof MODEL_SELECTION_KEYS[keyof typeof MODEL_SELECTION_KEYS];
type TemplateSelectionKey = typeof TEMPLATE_SELECTION_KEYS[keyof typeof TEMPLATE_SELECTION_KEYS];
type StorageKey = typeof ALL_STORAGE_KEYS[keyof typeof ALL_STORAGE_KEYS];

export { ALL_STORAGE_KEYS, ALL_STORAGE_KEYS_ARRAY, APIError, type AdvancedParameterDefinition, BaseError, type BuiltinTemplateLanguage, CORE_SERVICE_KEYS, ChangeType, CompareCalculationError, CompareError, type CompareOptions, type CompareResult, CompareService, CompareValidationError, type CoreServiceKey, DataManager, DexieStorageProvider, ERROR_MESSAGES, ElectronConfigManager, ElectronDataManagerProxy, ElectronHistoryManagerProxy, ElectronLLMProxy, ElectronModelManagerProxy, ElectronPreferenceServiceProxy, ElectronPromptServiceProxy, ElectronTemplateLanguageServiceProxy, ElectronTemplateManagerProxy, FileStorageProvider, HistoryChainError, HistoryError, HistoryManager, HistoryNotFoundError, type ICompareService, type IDataManager$1 as IDataManager, type IHistoryManager, type ILLMService, type IModelManager, type IPreferenceService, type IPromptService, type IStorageProvider, type ITemplateLanguageService, type ITemplateManager, InitializationError, IterationError, LLMError, type LLMResponse, LLMService, LocalStorageProvider, MODEL_SELECTION_KEYS, MemoryStorageProvider, type Message, type MessageTemplate, type ModelConfig, ModelConfigError, type ModelInfo, ModelManager, type ModelOption, type ModelSelectionKey, OptimizationError, type OptimizationMode, type OptimizationRequest, PreferenceService, PromptError, type PromptRecord, type PromptRecordChain, type PromptRecordType, PromptService, RecordNotFoundError, RecordValidationError, RequestConfigError, ServiceDependencyError, StaticLoader, StorageError, StorageFactory, type StorageKey, type StreamHandlers, TEMPLATE_SELECTION_KEYS, type Template, TemplateCacheError, TemplateError, TemplateLanguageService, TemplateLoadError, TemplateManager, type TemplateMetadata, TemplateProcessor, type TemplateSelectionKey, type TemplateSourceType, TemplateStorageError, TemplateValidationError, TestError, type TextFragment, type UISettingsKey, UI_SETTINGS_KEYS, ValidationError, advancedParameterDefinitions, checkVercelApiAvailability, createCompareService, createDataManager, createHistoryManager, createLLMService, createModelManager, createPreferenceService, createPromptService, createTemplateLanguageService, createTemplateManager, debugIPCSerializability, defaultModels, getProxyUrl, isBrowser, isElectronApiReady, isElectronRenderer, isRunningInElectron, messageTemplateSchema, resetVercelStatusCache, safeSerializeArgs, safeSerializeForIPC, templateSchema, waitForElectronApi };
