# 人腦互動解剖圖譜

[開啟線上版本](https://yunching0513.github.io/interactive-brain-atlas/)

一個可旋轉、縮放與點選的中英雙語人腦學習圖譜。內容分為：

- 外部腦葉／Cortical lobes
- 深部結構／Deep structures
- 情緒網絡與五種情境鏡頭／Emotion networks and contextual lenses
- 化學訊號／Chemical signals

化學訊號視圖收錄催產素、β-內啡肽、多巴胺、血清素、正腎上腺素、皮質醇與腎上腺素，說明主要來源、傳遞路徑、常見促發情境與反簡化提醒。

## Scientific scope

The cortical model uses the FreeSurfer `fsaverage5` average pial surface distributed with Nilearn. Lobe colors are approximate educational overlays; deep structures and chemical pathways are schematic. This atlas is not an individual MRI reconstruction, clinical parcellation, surgical-navigation tool or diagnostic system.

Emotions emerge from distributed neural and bodily systems. Neurotransmitters, neuropeptides and hormones are modulators—not one-to-one emotion switches.

## Sources and attribution

- [Nilearn `fetch_surf_fsaverage`](https://nilearn.github.io/stable/modules/generated/nilearn.datasets.fetch_surf_fsaverage.html)
- [FreeSurfer fsaverage](https://surfer.nmr.mgh.harvard.edu/fswiki/FsAverage)
- [NINDS Brain Basics](https://www.ninds.nih.gov/health-information/public-education/brain-basics)
- [NCBI Bookshelf: Oxytocin](https://www.ncbi.nlm.nih.gov/books/NBK507848/)
- [NCBI Bookshelf: Endorphin](https://www.ncbi.nlm.nih.gov/books/NBK470306/)
- [NCBI Bookshelf: Cortisol](https://www.ncbi.nlm.nih.gov/books/NBK538239/)
- [NCBI Bookshelf: Locus coeruleus](https://www.ncbi.nlm.nih.gov/books/NBK513270/)
- [NCBI Bookshelf: Serotonin](https://www.ncbi.nlm.nih.gov/books/NBK28150/)

Detailed surface-model attribution is in [`model/ATTRIBUTION.md`](model/ATTRIBUTION.md). Three.js is distributed under the MIT license; see [`vendor/THREE-LICENSE.txt`](vendor/THREE-LICENSE.txt).

## Local use

Open `index.html` directly in a modern browser. The production bundle is self-contained and does not require a server or network connection.
