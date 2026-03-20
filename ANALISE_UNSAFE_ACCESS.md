# Análise de Acesso Não Seguro em `src/App.tsx`

## Resumo
Foram encontrados **10 problemas críticos** de acesso não seguro que podem causar erros de "Cannot read properties of null" ou renderização indevida de "null"/"undefined".

---

## Componente: ProjetosView

### ❌ PROBLEMA 1 - Linha 2366
**Localização**: Card de projeto na grid, dentro do badge de responsável

```jsx
{projeto.responsavel && (
  <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
    <User size={10} className="text-blue-500 mr-1.5" />
    <span className="text-[9px] text-gray-600 font-medium">{projeto.responsavel?.nome || projeto.responsavel}</span>  // ❌ LINHA 2366
  </div>
)}
```

**Tipo**: Fallback unsafe sem proteção
**Risco**: O fallback `projeto.responsavel` pode ainda ser uma string vazia ou undefined, causando renderização indevida
**Solução**:
```jsx
<span className="text-[9px] text-gray-600 font-medium">{projeto.responsavel?.nome || '-'}</span>
```

---

## Componente: DetalheProjetoView

### ❌ PROBLEMA 2 - Linha 3734
**Localização**: Título do projeto no header

```jsx
<h2 className="text-[20px] font-bold text-[#1e315d]">{project.titulo}</h2>  // ❌ LINHA 3734
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Se `project` for null ou `project.titulo` for undefined, renderizará "undefined"
**Solução**:
```jsx
<h2 className="text-[20px] font-bold text-[#1e315d]">{project?.titulo || 'Projeto sem título'}</h2>
```

---

### ❌ PROBLEMA 3 - Linha 3743
**Localização**: Descrição do projeto no card de resumo

```jsx
<p className="text-[13px] text-gray-600 leading-relaxed">
  {project.descricao}  // ❌ LINHA 3743
</p>
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Renderizará "undefined" se a propriedade não existir
**Solução**:
```jsx
<p className="text-[13px] text-gray-600 leading-relaxed">
  {project?.descricao || 'Sem descrição'}
</p>
```

---

### ❌ PROBLEMA 4 - Linha 3748 (duplo problema)
**Localização**: Badge de status no card de resumo

```jsx
<span className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-bold whitespace-nowrap", project.statusColor)}>
  {project.status}  // ❌ LINHA 3748 (duplo)
</span>
```

**Ponto 1 - statusColor undefined**:
- Tipo: Acesso a propriedade que pode não existir
- Risco: `project.statusColor` pode não ser definido na resposta da API, causando classe CSS errada
- Solução:
```jsx
<span className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-bold whitespace-nowrap", project?.statusColor || 'bg-gray-50')}>
```

**Ponto 2 - status undefined**:
- Tipo: Acesso direto sem proteção
- Risco: Renderizará "undefined" se a propriedade não existir
- Solução:
```jsx
{project?.status || 'Sem status'}
```

---

### ❌ PROBLEMA 5 - Linha 3760
**Localização**: Texto do responsável no grid de detalhes

```jsx
<span className="text-[13px] font-medium">{project.responsavel}</span>  // ❌ LINHA 3760
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Renderizará "null" ou "undefined" se a propriedade não existir
**Solução**:
```jsx
<span className="text-[13px] font-medium">{project?.responsavel || '-'}</span>
```

---

### ❌ PROBLEMA 6 - Linha 3770
**Localização**: Badge de contagem de demandas no grid de detalhes

```jsx
<span className="text-[13px] font-medium">{project.demandas} vinculadas</span>  // ❌ LINHA 3770
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Renderizará "undefined vinculadas" ou "null vinculadas" se a propriedade não existir
**Solução**:
```jsx
<span className="text-[13px] font-medium">{project?.demandas || 0} vinculadas</span>
```

---

### ❌ PROBLEMA 7 - Linha 3777
**Localização**: Data de início no grid de detalhes

```jsx
<span className="text-[13px] font-medium">{project.inicio}</span>  // ❌ LINHA 3777
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Renderizará "undefined" se a propriedade não existir
**Solução**:
```jsx
<span className="text-[13px] font-medium">{project?.inicio || '-'}</span>
```

---

### ❌ PROBLEMA 8 - Linha 3784
**Localização**: Data de prazo no grid de detalhes

```jsx
<span className="text-[13px] font-medium">{project.vencimento}</span>  // ❌ LINHA 3784
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Renderizará "undefined" se a propriedade não existir
**Solução**:
```jsx
<span className="text-[13px] font-medium">{project?.vencimento || '-'}</span>
```

---

### ❌ PROBLEMA 9 - Linha 3795
**Localização**: Valor percentual de progresso no card de resumo

```jsx
<span className="text-[13px] font-bold text-[#3578d4]">{project.progresso}%</span>  // ❌ LINHA 3795
```

**Tipo**: Acesso direto sem null-coalescing
**Risco**: Renderizará "undefined%" se a propriedade não existir
**Solução**:
```jsx
<span className="text-[13px] font-bold text-[#3578d4]">{project?.progresso || 0}%</span>
```

---

### ❌ PROBLEMA 10 - Linha 3800
**Localização**: Barra de progresso no card de resumo (estilo inline)

```jsx
<div 
  className="h-full transition-all duration-500" 
  style={{ width: `${project.progresso}%`, backgroundColor: project.progressoColor }}  // ❌ LINHA 3800
/>
```

**Tipo**: Acesso direto a propriedades especulativas
**Risco**: 
- `project.progresso`: Renderizará "NaN%" se undefined
- `project.progressoColor`: Pode não ser definida, causando backgroundColor inválida
**Solução**:
```jsx
<div 
  className="h-full transition-all duration-500" 
  style={{ 
    width: `${project?.progresso || 0}%`, 
    backgroundColor: project?.progressoColor || '#3578d4'
  }}
/>
```

---

## Padrões de Segurança Recomendados

### ✅ PADRÃO 1: Optional Chaining + Nullish Coalescing
```jsx
{project?.titulo || 'Padrão'}
{project?.responsavel?.nome || '-'}
{datos?.usuario?.email ?? 'sem-email@example.com'}
```

### ✅ PADRÃO 2: Proteção Preventiva em Iterações
```jsx
{(array ?? []).map(item => (...))}
{(string ?? '').split(' ')}
```

### ✅ PADRÃO 3: Valores Padrão para Cálculos
```jsx
{(value ?? 0) * 100}%
${(price ?? 0).toFixed(2)}
```

---

## Resumo de Correções Necessárias

| Linha | Componente | Tipo | Severidade |
|-------|-----------|------|-----------|
| 2366 | ProjetosView | Fallback unsafe | 🔴 Alta |
| 3734 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3743 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3748 | DetalheProjetoView | Propriedade especulativa | 🔴 Alta |
| 3748 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3760 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3770 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3777 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3784 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3795 | DetalheProjetoView | Acesso direto | 🔴 Alta |
| 3800 | DetalheProjetoView | Duplo acesso direto | 🔴 Alta |

---

## Impacto

- **Usuários afetados**: Todos que acessam a visualização de projetos
- **Sintomas**: 
  - Renderização de "null" ou "undefined" no UI
  - Barras de progresso com largura inválida
  - Cores de status incorretas ou ausentes
- **Frequência**: Alta (ocorre sempre que dados da API estão incompletos ou malformados)

