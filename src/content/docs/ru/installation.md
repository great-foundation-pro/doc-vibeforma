---
title: Установка
description: Требования, команда быстрой установки, параметры установщика и место установки.
---

## Требования

- Windows 10 или Windows 11, x64.
- Python 3.10 или новее в `PATH`.

## Быстрый старт

Выполните в PowerShell:

```powershell
irm https://raw.githubusercontent.com/FormaMindPro/vibeforma/main/install.ps1 | iex
```

Установщик размещает VibeForma в `%LOCALAPPDATA%\VibeForma`.

## Параметры установщика

Установщик принимает следующие параметры:

- `-Model`
- `-Target`
- `-Cpu`
- `-DryRun`
- `-NoRun`

Что делает каждый из них, описано в `install.ps1` в репозитории [FormaMindPro/vibeforma](https://github.com/FormaMindPro/vibeforma).

## Сеть

Модель распознавания скачивается один раз, и для этого нужна сеть. После этого диктовка работает офлайн; сеть используется снова для обновлений.

Горячая клавиша по умолчанию — `Ctrl+Alt+Space`.
