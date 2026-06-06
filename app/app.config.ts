export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    },
    prose: {
      a: {
        base: 'text-blue-300 underline decoration-blue-300/30 underline-offset-4 hover:text-white hover:decoration-white/50 transition-colors'
      },
      blockquote: {
        base: 'border-l-2 border-blue-300/40 ps-4 italic text-slate-300'
      },
      badge: {
        base: 'inline-flex items-center rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-xs font-medium text-slate-100'
      },
      callout: {
        slots: {
          base: 'group relative block my-5 rounded-lg border border-white/10 bg-[#0b1118]/95 px-4 py-3 text-sm/6 text-slate-200 shadow-[0_16px_32px_rgba(0,0,0,0.28)] [&_code]:bg-black/35 [&_pre]:bg-[#070b10] [&>*]:last:mb-0',
          icon: 'size-4 shrink-0 align-sub me-1.5 inline-block text-blue-300',
          externalIcon:
            'size-4 align-top absolute right-3 top-3 text-slate-500 pointer-events-none'
        }
      },
      card: {
        slots: {
          base: 'group relative block my-5 rounded-lg border border-white/10 bg-[#11161c]/90 p-5 shadow-[0_18px_36px_rgba(0,0,0,0.32)] transition duration-200 hover:border-blue-300/35 hover:bg-[#151c24]',
          icon: 'mb-3 block size-5 text-blue-300',
          title: 'text-base font-semibold leading-6 text-white',
          description: 'mt-2 text-sm/7 text-slate-300 *:first:mt-0 *:last:mb-0',
          externalIcon:
            'absolute right-3 top-3 size-4 text-slate-500 transition-colors group-hover:text-blue-300'
        }
      },
      cardGroup: {
        base: 'my-5 grid grid-cols-1 gap-4 sm:grid-cols-2 *:my-0'
      },
      code: {
        base: 'inline-block rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-sm font-medium text-slate-100'
      },
      pre: {
        slots: {
          root: 'relative my-5 group',
          header:
            'relative flex items-center gap-1.5 rounded-t-lg border border-white/10 border-b-0 bg-[#11161c] px-4 py-3',
          filename: 'text-slate-200 text-sm/6',
          copy: 'absolute top-[11px] right-[11px] border-white/15 bg-black/40 text-slate-200 hover:bg-white/10 lg:opacity-0 lg:group-hover:opacity-100 transition',
          base: 'group overflow-x-auto rounded-lg border border-white/10 bg-[#070b10] px-4 py-3 font-mono text-sm/6 text-slate-100 whitespace-pre-wrap break-words focus:outline-none'
        }
      },
      codeGroup: {
        slots: {
          root: 'relative my-5 group *:not-first:!my-0 *:not-first:!static',
          list: 'relative flex items-center gap-1 overflow-x-auto rounded-t-lg border border-white/10 border-b-0 bg-[#11161c] p-2',
          indicator:
            'absolute inset-y-2 left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) rounded-md bg-white/10 shadow-sm transition-[translate,width] duration-200',
          trigger:
            'relative inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 data-[state=active]:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/50',
          triggerIcon: 'size-4 shrink-0',
          triggerLabel: 'truncate'
        }
      },
      codeCollapse: {
        slots: {
          root: 'relative [&_pre]:h-[220px]',
          footer:
            'absolute inset-x-px bottom-px flex h-16 items-center justify-center rounded-b-lg bg-gradient-to-t from-[#070b10] via-[#070b10]/90 to-transparent',
          trigger: 'group border-white/15 bg-black/35 text-slate-200 hover:bg-white/10',
          triggerIcon: 'transition-transform group-data-[state=open]:rotate-180'
        }
      },
      table: {
        slots: {
          root: 'relative my-6 overflow-x-auto bg-[#0b1118]',
          base: 'w-full min-w-max border-separate border-spacing-0'
        }
      },
      accordion: {
        slots: {
          root: 'my-5 rounded-lg border border-white/10 bg-[#0b1118]/95',
          trigger: 'text-base text-slate-100 hover:text-white'
        }
      },
      accordionItem: {
        base: 'px-4 pb-4 text-sm/7 text-slate-300 *:first:mt-0 *:last:mb-0 *:my-1.5'
      },
      collapsible: {
        slots: {
          root: 'my-5 rounded-lg border border-white/10 bg-[#0b1118]/95 px-4 py-3',
          trigger:
            'group relative inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/50',
          triggerIcon:
            'size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180',
          triggerLabel: 'truncate',
          content:
            'mt-3 border-t border-white/10 pt-3 text-sm/7 text-slate-300 *:first:mt-0 *:last:mb-0'
        }
      },
      tabs: {
        slots: {
          root: 'my-5 gap-4 rounded-lg border border-white/10 bg-[#0b1118]/95 p-3',
          list: 'relative flex items-center gap-1 overflow-x-auto border-b border-white/10 pb-2',
          indicator:
            'absolute bottom-0 left-0 h-px w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) bg-blue-300 transition-[translate,width] duration-200',
          trigger:
            'relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-100 data-[state=active]:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/50',
          triggerIcon: 'size-4 shrink-0',
          triggerLabel: 'truncate'
        }
      },
      tabsItem: {
        base: 'pt-2 text-sm/7 text-slate-300 *:first:mt-0 *:last:mb-0 *:my-1.5'
      },
      steps: {
        base: 'ms-4 border-s border-white/10 ps-8 [counter-reset:step] [&>h3]:[counter-increment:step] [&>h3]:relative [&>h3]:before:absolute [&>h3]:before:-ms-[48.5px] [&>h3]:before:inline-flex [&>h3]:before:size-7 [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:rounded-full [&>h3]:before:border [&>h3]:before:border-blue-300/30 [&>h3]:before:bg-[#11161c] [&>h3]:before:text-sm [&>h3]:before:font-semibold [&>h3]:before:text-blue-200 [&>h3]:before:content-[counter(step)] [&>h3>a>span.absolute]:hidden'
      },
      field: {
        slots: {
          root: 'my-5 rounded-lg border border-white/10 bg-[#0b1118]/95 p-4',
          container: 'flex items-center gap-3 font-mono text-sm',
          name: 'font-semibold text-blue-200',
          wrapper: 'flex flex-1 items-center gap-1.5 text-xs',
          required: 'rounded-md bg-red-500/10 px-1.5 py-0.5 text-red-200',
          type: 'rounded-md bg-white/10 px-1.5 py-0.5 text-slate-300',
          description: 'mt-3 text-sm/7 text-slate-400 [&_code]:text-xs/4'
        }
      },
      fieldGroup: {
        base: 'my-5 divide-y divide-white/10 rounded-lg border border-white/10 bg-[#0b1118]/95 *:not-last:pb-5 *:not-first:pt-5 *:my-0 *:border-0 *:bg-transparent *:p-0'
      },
      kbd: {
        base: 'align-text-top rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-xs text-slate-100 shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)]'
      },
      icon: {
        base: 'inline-block size-4 align-[-0.125em] text-blue-300'
      }
    }
  }
})
