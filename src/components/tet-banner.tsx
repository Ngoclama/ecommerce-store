export const TetBanner = () => {
  return (
    <div className="banner-tet mb-6 md:mb-8">
      <div className="decoration-corner top-left">🧧</div>
      <div className="decoration-corner top-right">🎊</div>
      <div className="decoration-corner bottom-left">🎊</div>
      <div className="decoration-corner bottom-right">🧧</div>

      <h2 className="banner-tet-title">🎊 Chúc Mừng Năm Mới - Xuân 2026 🎊</h2>
      <p className="banner-tet-subtitle">
        An khang – Thịnh vượng – Vạn sự như ý
      </p>

      <div className="mt-4 flex gap-2 justify-center flex-wrap">
        <button className="btn-tet">🎁 Mua sắm đầu năm</button>
        <button className="btn-tet-secondary">🧧 Nhận Lì Xì</button>
      </div>
    </div>
  );
};
